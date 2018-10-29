const express = require("express");

async function setupServer() {
  const next = await require("./next")();
  const app = express();

  require("./express")(app, next);

  await require("../db")();

  return app;
}

module.exports = setupServer;
