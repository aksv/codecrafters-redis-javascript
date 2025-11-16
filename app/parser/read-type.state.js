/**
 * @typedef {import('./parser-context')} IParserContext
 * @typedef {import('../../types/state').State} IState
 * @typedef {import('../../types/state').EmitFunction} EmitFunction
*/

const ReadBulkStringState = require('./read-bulk-string.state');
const { parseNumber } = require('../utils');
const { LF, ARRAY_PREFIX, BULK_STR_PREFIX } = require('./constants');

/**
 * @implements {IState}
 */
class ReadTypeState {
  /**
   * @param {IParserContext} ctx
   * @param {EmitFunction} emit
   * @returns {IState}
   */
  handle(ctx, emit) {
    const data = ctx.readUntil(LF);
    if (data === null) {
      return this;
    }
    const typeChar = data.readUint8(0);
    const size = parseNumber(data);
    //*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n
    switch(typeChar) {
      case ARRAY_PREFIX:
        emit({ stateType: 'RESP_ARRAY', length: size });
        return new ReadTypeState();
      case BULK_STR_PREFIX:
        return new ReadBulkStringState(size, () => new ReadTypeState());
      default:
        throw new Error(`Unsupported RESP type: ${typeChar}`);
    }
  }
}

module.exports = ReadTypeState;
