const autoBind = require("auto-bind");

class PTTThink {
  constructor() {
    autoBind(this);

    this.r = require("rethinkdb");
    this.models = {};
  }

  async prepare({ host, port, db = "test" }) {
    if (!host || !port) {
      throw new Error(
        `PTTThink couldnt initialise, host and port must be defined, got ${host}:${port}`
      );
    }
    this.config = { host, port, db };

    this.withConnection(async ({ r, connection }) => {
      try {
        const dbList = await r.dbList().run(connection);

        if (dbList.includes(this.config.db)) {
          this.ready = true;
          return true;
        } else {
          const result = await r.dbCreate(this.config.db);
          this.ready = true;
          return true;
        }
      } catch (err) {
        console.warn("Error setting up database", err);
        this.ready = false;
        return false;
      }
    });
  }

  async withConnection(process) {
    let connection;
    const { r, config } = this;

    if (!config || !r) {
      throw Error(
        "PTTThink must be prepared before trying to open a connection"
      );
    }

    try {
      connection = await r.connect(config);
      await process({ r, connection });
    } catch (err) {
      console.warn("Failed running process with connection", err);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

module.exports = new PTTThink();
