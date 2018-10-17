const r = require("rethinkdb");
const path = require("path");
const { emitNewTimer } = require("../../socket/actions");

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
      return result.generated_keys[0];
    } else {
      throw `Failed to insert single timer for user ${user}`;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function listen(socket) {
  const connection = await require("../connection");

  try {
    const cursor = await r
      .table(TABLE_NAME)
      .changes()
      .run(connection);

    cursor.each((err, item) => {
      if (item && item.new_val) {
        emitNewTimer({ socket, item });
      }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  TABLE_NAME,
  insertOne,
  listen
};
