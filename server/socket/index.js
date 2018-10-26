function setupSocket(server) {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    console.log("new connection");

    /*
    const Timers = require("../db/tables/timers");
    Timers.listen(socket);
    */
  });

  io.on("disconnect", reason => {
    console.log(`disconnected: ${reason}`);
  });
}

module.exports = setupSocket;
