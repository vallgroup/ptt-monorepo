function emitNewTimer({ socket, item }) {
  socket.emit("timers:new", { timer: item.new_val });
}

module.exports = {
  emitNewTimer
};
