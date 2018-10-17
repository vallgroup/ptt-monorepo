const fs = require("fs");
const path = require("path");

async function setup() {
  const connection = await require("./connection");
  await require("./tables")();
}

module.exports = setup;
