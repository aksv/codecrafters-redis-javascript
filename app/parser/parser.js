/**
 * @typedef {import('../../types/state').Frame} IFrame
 */
const { Buffer } = require('node:buffer');

const ParserContext = require('./parser-context');
const ReadTypeState = require('./read-type.state');
class Parser {
  #context;
  #state;
  /** @type {Buffer[]} */
  #array = [];
  /** @type {number} */
  #currentArraySize = 0
  /** @type {Buffer[][]} */
  #commands = [];
  constructor() {
    this.#context = new ParserContext();
    this.#state = new ReadTypeState();
    this.emit = this.emit.bind(this);
  }

  /**
   *
   * @param {IFrame} frame
   */
  emit(frame) {
    switch(frame.stateType) {
      case 'RESP_ARRAY':
        this.#currentArraySize = frame.length;
        return;
      case 'BULK_STRING':
        this.#array.push(frame.value);
        if (this.#array.length === this.#currentArraySize) {
          this.#commands.push([...this.#array]);
          this.#array = [];
          this.#currentArraySize = 0;
        }
        return;
      default:
        // @ts-ignore
        throw new Error(`Unsupported frame state type ${frame.stateType}`)
    }
  }

  /**
   *
   * @param {Buffer} chunk
   */
  parse(chunk) {
    this.#context.append(chunk);
    while(this.#context.length > 0) {
      this.#state = this.#state.handle(this.#context, this.emit);
    }
    if (this.#commands.length > 0) {
      const commands = [...this.#commands];
      this.#commands = [];
      return commands;
    }
  }
}

module.exports = Parser;
