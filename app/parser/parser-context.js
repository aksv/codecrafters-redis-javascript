const { Buffer } = require('node:buffer');

const MAX_BUFFER_SIZE = 8 * 1024;
const BUFFER_RESERVE = 1024;

/**
 * @typedef {import('../../types/parser-context').ParserContext} IParserContext
 */

/**
 * @implements {IParserContext}
 */
class ParserContext {
  /** @type {Buffer} */
  #buffer;
  /** @type {number} */
  #length;

  constructor(size = MAX_BUFFER_SIZE) {
    this.#buffer = Buffer.allocUnsafe(size);
    this.#length = 0;
  }

  /** @param {number} minSize */
  #resize(minSize) {
    const size = minSize + BUFFER_RESERVE;
    const newBuffer = Buffer.allocUnsafe(size);
    this.#buffer.copy(newBuffer, 0, 0, this.#length);
    this.#buffer = newBuffer;
  }

  /**
   * Append data chunk to internal buffer
   * @param {Buffer} chunk
   */
  append(chunk) {
    if (this.#length + chunk.length > this.#buffer.length) {
      this.#resize(this.#length + chunk.length);
    }
    chunk.copy(this.#buffer, this.#length);
    this.#length += chunk.length;
  }

  /**
   * @returns {number} current length of internal buffer
   */
  get length() {
    return this.#length;
  }

  /**
   * Try to read n length bytes from internal buffer
   * @param {number} n bytes to read
   * @returns {Buffer<ArrayBufferLike> | null}
   */
  readBytes(n) {
    if (this.#length < n) {
      return null;
    }
    const data = Buffer.from(this.#buffer.subarray(0, n));
    this.#buffer.copy(this.#buffer, 0, n, this.#length);
    this.#length -= n;
    return data;
  }

  /**
   * Read buffer until the end or first occurence of code (including the code)
   * @param {number} code
   * @returns {Buffer<ArrayBufferLike> | null}
   */
  readUntil(code) {
    const idx = this.#buffer.indexOf(code);
    if (idx === -1 || idx >= this.#length) {
      return null;
    }
    const end = idx + 1;
    const data = Buffer.from(this.#buffer.subarray(0, end));
    this.#buffer.copy(this.#buffer, 0, end, this.#length);
    this.#length -= data.length;
    return data;
  }
}

module.exports = ParserContext;
