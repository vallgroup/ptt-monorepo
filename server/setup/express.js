const bodyParser = require("body-parser");
const helmet = require("helmet");
const express = require("express");
const { appConfig } = require("../config");
const setupRoutes = require("../routes");

function setupExpress(app, next) {
  const { publicDir } = appConfig;
  const { handler, nextApp } = next;

  app.use(helmet());
  app.use(express.static(publicDir));
  app.use(bodyParser.json());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", require("../api"));
  app.use("/", setupRoutes(handler, nextApp));
}

module.exports = setupExpress;
