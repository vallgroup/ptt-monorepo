const { dbConfig } = require("../config");
const PTTThink = require("../lib/PTTThink");

async function setup() {
  await PTTThink.prepare(dbConfig);

  const { Timer } = require("./models/Timer");

  const newTimer = await Timer.insertOne({ user: "123" });

  console.log(newTimer);
}

module.exports = setup;
