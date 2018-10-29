const { Timers } = require("../db/models/Timers");

function setupSocket(server) {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    console.log("new connection");

    Timers.listen(socket);
  });

  io.on("disconnect", reason => {
    console.log(`disconnected: ${reason}`);
  });
}

module.exports = setupSocket;
