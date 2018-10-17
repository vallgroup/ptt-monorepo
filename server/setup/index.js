const express = require("express");

async function setupServer() {
  const next = await require("./next")();

  const app = express();

  require("./express")(app, next);
  require("../db/connection");

  return app;
}

module.exports = setupServer;
