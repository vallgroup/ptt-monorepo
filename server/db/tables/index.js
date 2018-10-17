const r = require("rethinkdb");
const fs = require("fs");
const path = require("path");

async function createTables() {
  const connection = await require("../connection");

  const tablesDir = __dirname;

  const existingTables = await r.tableList().run(connection);

  // we build the tables based on the tables in this directory
  fs.readdir(tablesDir, (err, files) => {
    if (err) console.log(err);

    files.forEach(file => {
      const fileName = file.split(".");

      if (
        fileName[1] === "js" &&
        fileName[0] !== "index" &&
        !existingTables.includes(fileName[0])
      ) {
        r.tableCreate(fileName[0]).run(connection);
      }
    });
  });
}

module.exports = createTables;
