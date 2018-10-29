const { dbConfig } = require("../config");
const PTTThink = require("../lib/PTTThink");

async function setup() {
  await PTTThink.prepare(dbConfig);

  require("./models/Timers");
}

module.exports = setup;
