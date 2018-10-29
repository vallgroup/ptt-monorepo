const { dbConfig } = require("../config");
const PTTThink = require("./PTTThink");

async function setup() {
  await PTTThink.prepare(dbConfig);

  await PTTThink.model("timer", {});
}

module.exports = setup;
