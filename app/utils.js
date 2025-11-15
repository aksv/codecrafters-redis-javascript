const { Buffer } = require('node:buffer');

/**
 *
 * @param {Buffer} buffer
 */
function parseNumber(buffer, start = 1, trimEnd = 2) {
  const numStr = buffer.subarray(start, buffer.length - trimEnd).toString('ascii');
  return parseInt(numStr);
}

module.exports = {
  parseNumber,
};
