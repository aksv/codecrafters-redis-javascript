const { Buffer } = require('node:buffer');
const { parseNumber } = require('./utils');

describe('utils', () => {
  it('should parse number', () => {
    const The_Answer_to_the_Ultimate_Question_of_Life_the_Universe_and_Everything = 42;
    const buff = Buffer.from('*42\r\n');
    const num = parseNumber(buff);
    expect(num).toBe(The_Answer_to_the_Ultimate_Question_of_Life_the_Universe_and_Everything);
  })
})
