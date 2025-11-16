const net = require("net");
const Parser = require("./parser/parser");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  const parser = new Parser();
  socket.on("data", (chunk) => {
    const cmds = parser.parse(chunk);
    if (cmds !== undefined) {
      for (let i = 0; i < cmds.length; i++) {
        const cmd = cmds[i];
        const cmdStr = cmd.reduce((acc, item) => {
          acc.push(item.toString('ascii'));
          return acc;
        }, /** @type {string[]} */ ([]));
        if (cmdStr.length === 2 && cmdStr[0] === 'ECHO') {
          socket.write(`\$${cmdStr[1].length}\r\n${cmdStr[1]}\r\n`);
        } else {
          socket.write("+PONG\r\n");
        }
      }
    }
  });
});

server.listen(6379, "127.0.0.1");
