const r = require("rethinkdb");
const path = require("path");

const TABLE_NAME = path.basename(__filename, ".js");

async function insertOne({ user }) {
  const connection = await require("../connection");

  try {
    const result = await r
      .table(TABLE_NAME)
      .insert({
        user,
        time: r.now()
      })
      .run(connection);

    if (result.inserted === 1) {
      console.log(result.generated_keys[0]);
      return result.generated_keys[0];
    } else {
      throw `Failed to insert single timer for user ${user}`;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  TABLE_NAME,
  insertOne
};
