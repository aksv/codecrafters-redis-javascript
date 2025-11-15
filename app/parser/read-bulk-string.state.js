/**
 * @typedef {import('../../types/parser-context').ParserContext} IParserContext
 * @typedef {import('../../types/state').State} IState
 * @typedef {import('../../types/state').EmitFunction} EmitFunction
 */

//const ReadTypeState = require('./read-type.state');
//const {} = require('./constants');

/**
 * @implements {IState}
 */
class ReadBulkStringState {
  #length;

  /** @param {number} length  */
  constructor(length) {
    this.#length = length;
  }

  /**
   * Try to read bulk string
   * @param {IParserContext} ctx
   * @param {EmitFunction} emit
   * @returns {IState} next state
   */
  handle(ctx, emit) {
    const buffer = ctx.readBytes(this.#length + 2);
    if (buffer === null) {
      return this;
    }
    emit({ stateType: 'BULK_STRING', value: buffer.subarray(0, this.#length) });
    const ReadTypeState = require('./read-type.state');
    return new ReadTypeState();
  }

}

module.exports = ReadBulkStringState;
