const { Buffer } = require('node:buffer');

const ParserContext = require('./parser-context');
const ReadTypeState = require('./read-type.state');

describe('ReadTypeState', () => {
  it('should call emit with array length if type is array', () => {
    const ctx = new ParserContext();
    const emit = jest.fn();
    ctx.append(Buffer.from('*3\r\n'));
    const state = new ReadTypeState();
    const nextState = state.handle(ctx, emit);
    expect(nextState).not.toBeNull();
    expect(emit).toHaveBeenCalledWith({ stateType: 'RESP_ARRAY', length: 3 });
  });

  it('should not call emit with if type is bulk string', () => {
    const ctx = new ParserContext();
    const emit = jest.fn();
    ctx.append(Buffer.from('$3\r\nHELLO\r\n'));
    const state = new ReadTypeState();
    const nextState = state.handle(ctx, emit);
    expect(nextState).not.toBeNull();
    expect(emit).not.toHaveBeenCalled();
  });
});
