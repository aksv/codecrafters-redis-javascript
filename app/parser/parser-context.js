const { Buffer } = require('node:buffer');

/**
 * @typedef {import('../../types/parser-context').ParserContext} IParserContext
 */

/**
 * @implements {IParserContext}
 */
class ParserContext {
  /** @type {Buffer} */
  #buffer;

  constructor() {
    this.#buffer = Buffer.alloc(0);
  }

  /**
   * Append data chunk to internal buffer
   * @param {Buffer} chunk
   */
  append(chunk) {
    this.#buffer = Buffer.concat([this.#buffer, chunk]);
  }

  /**
   * @returns {number} current length of internal buffer
   */
  get length() {
    return this.#buffer.length;
  }

  /**
   * Try to read n length bytes from internal buffer
   * @param {number} n bytes to read
   * @returns {Buffer<ArrayBufferLike> | null}
   */
  readBytes(n) {
    if (this.#buffer.length < n) {
      return null;
    }
    const data = this.#buffer.subarray(0, n);
    this.#buffer = this.#buffer.subarray(n);
    return data;
  }

  /**
   * Read buffer until the end or first occurence of code (including the code)
   * @param {number} code
   * @returns {Buffer<ArrayBufferLike> | null}
   */
  readUntil(code) {
    const idx = this.#buffer.indexOf(code);
    if (idx === -1) {
      return null;
    }
    const readIdx = idx + 1;
    const data = this.#buffer.subarray(0, idx + 1);
    this.#buffer = this.#buffer.subarray(readIdx);
    return data;
  }

  readInt8() {
    if (this.#buffer.length === 0) {
      return -1;
    }
    const data = this.#buffer.readUInt8(0);
    this.#buffer = this.#buffer.subarray(1);
    return data;
  }
}

module.exports = ParserContext;
