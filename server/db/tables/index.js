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
      const ext = path.extname(file);
      const name = path.basename(file, ext);

      if (ext === "js" && name !== "index" && !existingTables.includes(name)) {
        r.tableCreate(name).run(connection);
      }
    });
  });
}

module.exports = createTables;
