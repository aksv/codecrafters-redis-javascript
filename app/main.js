const net = require("net");
const { Buffer } = require('node:buffer');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

let buffer = Buffer.alloc(0);

const server = net.createServer((socket) => {
    socket.on('data', (chunk) => {
        socket.write('+PONG\r\n');
    })
});

server.listen(6379, "127.0.0.1");
