const { Buffer } = require('node:buffer');

const ParserContext = require('./parser-context');
const ReadBulkStringState = require('./read-bulk-string.state');
const ReadTypeState = require('./read-type.state');

describe('ReadTypeState', () => {
  it('should read string', () => {
    const ctx = new ParserContext();
    const emit = jest.fn();
    ctx.append(Buffer.from('HELLO\r\n$4TEST\r\n$5PART'));
    const state = new ReadBulkStringState(5, () => new ReadTypeState());
    const nextState = state.handle(ctx, emit);
    expect(nextState).not.toBeNull();
    expect(emit).toHaveBeenCalledWith({ stateType: 'BULK_STRING', value: Buffer.from('HELLO') });
    expect(ctx.length).toBe(14);
  });
});
