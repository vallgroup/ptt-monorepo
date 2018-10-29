const { dbConfig } = require("../config");
const PTTThink = require("../lib/PTTThink");

async function setup() {
  await PTTThink.prepare(dbConfig);

  await PTTThink.model("timer", {});
}

module.exports = setup;
