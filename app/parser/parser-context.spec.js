const { Buffer } = require("node:buffer");
const ParserContext = require("./parser-context");

// \n
const LF = 10;

describe("Parser context", () => {
  describe("context operations", () => {
    it("should resize buffer if there is not enough space to save data", () => {
      const context = new ParserContext(4);
      context.append(Buffer.from("1234"));
      expect(context.length).toBe(4);
      context.append(Buffer.from("56789"));
      expect(context.length).toBe(9);
      const data = context.readBytes(9);
      expect(data?.toString("utf-8")).toBe("123456789");
    });

    it("should get internal buffer length", () => {
      const context = new ParserContext();
      expect(context.length).toBe(0);
      context.append(Buffer.from("test"));
      expect(context.length).toBe(4);
    });

    it("should return null if in buffer is not enough bytes to read", () => {
      const context = new ParserContext();
      context.append(Buffer.from("te"));
      expect(context.readBytes(4)).toBeNull();
    });

    it("should return bytes from buffer is there are expected number of bytes to read", () => {
      const context = new ParserContext();
      context.append(Buffer.from("test"));
      const data = context.readBytes(4);
      expect(data).not.toBeNull();
      expect(data?.toString("ascii")).toBe("test");
    });

    it("should remove bytes returned by readBytes from buffer", () => {
      const context = new ParserContext();
      context.append(Buffer.from("hello world"));
      expect(context.length).toBe(11);
      const data = context.readBytes(11);
      expect(data).not.toBeNull();
      expect(context.length).toBe(0);
    });

    it("should read bytes until the code if code exists", () => {
      const context = new ParserContext();
      context.append(Buffer.from("*2\r\n$2TT\r\n$1A"));
      const data = context.readUntil(LF);
      expect(data?.length).toBe(4);
      expect(data?.toString("ascii")).toBe("*2\r\n");
      expect(context.length).toBe(9);
    });

    it("should return null if code not exists", () => {
      const context = new ParserContext();
      context.append(Buffer.from("*12\r"));
      const data = context.readUntil(LF);
      expect(data).toBe(null);
    });
  });

  describe('context internal buffer shrink/grow operations', () => {
    it('should preserve order on resize', () => {
      const context = new ParserContext(2);
      context.append(Buffer.from('ab'));
      context.append(Buffer.from('cdef'));
      const data = context.readBytes(6);
      expect(context.length).toBe(0);
      expect(data?.toString('ascii')).toBe('abcdef');
    });

    it('should shift data correctly on partial reads', () => {
      const context = new ParserContext();
      context.append(Buffer.from('ABCDEFGHIJ'));
      const firstRead = context.readBytes(4);
      const secondRead = context.readBytes(4);
      expect(firstRead?.toString('ascii')).toBe('ABCD');
      expect(secondRead?.toString('ascii')).toBe('EFGH');
      expect(context.length).toBe(2);
      const thirdRead = context.readBytes(2);
      expect(thirdRead?.toString('ascii')).toBe('IJ');
    });

    it('should leave remaining bytes untouched on readUntil', () => {
      const context = new ParserContext();
      context.append(Buffer.from('*2\r\n$3foo\r\n$3bar\r\n'));
      const firstRead = context.readUntil(LF);
      const secondRead = context.readUntil(LF);
      expect(firstRead?.toString('ascii')).toBe('*2\r\n');
      expect(secondRead?.toString('ascii')).toBe('$3foo\r\n');
      const thirdRead = context.readBytes(7);
      expect(thirdRead?.toString('ascii')).toBe('$3bar\r\n');
    });
  });
});
