const { Buffer } = require('node:buffer');
// \r
const CR = 13;
// \n
const LF = 10;
// *
const RESP_ARR_PREFIX = 42;
// $
const BULK_STR_PREFIX = 36;



class RespParser {
  #buffer = Buffer.alloc(0);
  /** @type {Buffer<ArrayBuffer} */
  //#cmdElements = [];
  //#inBulkStr = false;
  //#inCommand = false;
  //#expectedElements;
  //#currBulkStrLen;

  /**
   * Parse next chunk of RESP data
   * @param {Buffer} chunk
   */
  /* parseChunk(chunk) {
    let i = 0;
    while(i < chunk.length) {
      const currElem = chunk[i];
      switch(true) {
        case this.#inBulkStr:
          // Pervious chunk contains start of bulk string and we looking for rest of the data
          if (this.#currBulkStrLen === this.#buffer.length + 1) {
            // we've read all expected bytes for current bulk string
            const str = Buffer.concat([this.#buffer, chunk.subarray(i, i+1)]);

          }
          continue;
        case currElem === RESP_ARR_PREFIX:
          continue;
        case currElem === BULK_STR_PREFIX:
          continue;
        default:
          // Skip LFCR
          continue;
      }
    }
  } */
}

/**
 * RESP parser
 * @param {Buffer} chunk
 */
function processBuffer(chunk) {
  //*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n
  let i = 0;
  while (i < chunk.length) {
    if(chunk[i] === RESP_ARR_PREFIX) {

    }
  }
}
