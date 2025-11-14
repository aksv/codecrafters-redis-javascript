const net = require("net");
const { Buffer } = require('node:buffer');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

//let buffer = Buffer.alloc(0);

// \r
const CR = 13;
// \n
const LF = 10;
// *
const RESP_ARR_PREFIX = 42;
// $
const BULK_STR_PREFIX = 36;


const server = net.createServer((socket) => {
    socket.on('data', (chunk) => {
        //*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n
       let respArrLength;
       const data = [];
        for (let i = 0; i < chunk.length;) {
            if (chunk[i] === RESP_ARR_PREFIX) {
                respArrLength = parseInt(chunk.subarray(i+1, i+3).toString('ascii'));
                i += 2;
                continue;
            }
            if (chunk[i] === BULK_STR_PREFIX) {
                const byteToRead = parseInt(chunk.subarray(i+1, i+3).toString('ascii'));
                const str = chunk.subarray(i+4, i + 4 + byteToRead).toString('ascii');
                data.push(str);
                i += 4 + byteToRead + 1;
                continue;
            }
            i += 1;
        }
        if (data.length === 2 && data[0] === 'ECHO') {
            socket.write(`\$${data[1].length}\r\n${data[1]}\r\n`);
        } else {
            socket.write('+PONG\r\n');
        }
    })
});

server.listen(6379, "127.0.0.1");
