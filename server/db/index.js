const { dbConfig } = require("../config");
const PTTThink = require("./PTTThink");

async function setup() {
  await PTTThink.prepare(dbConfig);
}

module.exports = setup;
