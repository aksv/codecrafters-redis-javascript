/**
 * @typedef {import('../../types/parser-context').ParserContext} IParserContext
 * @typedef {import('../../types/state').State} IState
 * @typedef {import('../../types/state').StateFactory} StateFactory
 * @typedef {import('../../types/state').EmitFunction} EmitFunction
 */

/**
 * @implements {IState}
 */
class ReadBulkStringState {
  #length;
  #nextStateFactory;

  /**
   * @param {number} length
   * @param { StateFactory} nextStateFactory
   *
  */
  constructor(length, nextStateFactory) {
    this.#length = length;
    this.#nextStateFactory = nextStateFactory;
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
    return this.#nextStateFactory();
  }

}

module.exports = ReadBulkStringState;
