const { dbConfig } = require("../config");

async function connect() {
  r = require("rethinkdb");

  const { host, port } = dbConfig;

  const connection = await r.connect({ host, port });

  return connection;
}

module.exports = connect();
