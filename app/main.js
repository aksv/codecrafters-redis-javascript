const net = require("net");
const Parser = require("./parser/parser");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const keys = new Map();

//TODO: move commands wrapper to separate module
const commands = new Map();

commands.set('SET', /** @param {string[]} args */ (args) => {
  keys.set(args[0], args[1]);
  return '+OK\r\n';
});

commands.set('GET', /** @param {string[]} args */ (args) => {
  if (keys.has(args[0])) {
    const val = keys.get(args[0]);
    return `\$${val.length}\r\n${val}\r\n`
  }
  return '$-1\r\n';
});

commands.set('ECHO', /** @param {string[]} args */ (args) => {
  return `\$${args[0].length}\r\n${args[0]}\r\n`;
});

commands.set('PING', () => {
  return "+PONG\r\n";
});


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
        let commandHandler;
        if (commands.has(cmdStr[0].toUpperCase())) {
          commandHandler = commands.get(cmdStr[0].toUpperCase());
        } else {
          commandHandler = commands.get('PING');
        }
        const resp = commandHandler(cmdStr.slice(1));
        socket.write(resp);
      }
    }
  });
});

server.listen(6379, "127.0.0.1");
