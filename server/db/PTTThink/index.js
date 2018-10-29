const autoBind = require("auto-bind");

/**
 * Our master RethinkDB class which will wrap all DB logic
 */
class PTTThink {
  /**
   * Constructor in this case is just responsible for binding functions and setting up our class variables
   */
  constructor() {
    // see https://www.npmjs.com/package/auto-bind
    autoBind(this);

    this.r = require("rethinkdb");
    this.models = {};
  }

  /**
   * Tries to set up our db with given config,
   * must be run before PTTThink can be used
   *
   * @param  {String}  host
   * @param  {Number}  port
   * @param  {String}  [db="test"]
   * @return {Promise} Will resolve to a boolean letting us know if the setup was successful
   */
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

  /**
   * Since node runs a single thread, we have to be careful using a single connection instance.
   *
   * This function should be used to wrap any process which interacts with the database
   * to make sure that a connection is successfully opened and closed specifically for that process.
   *
   * @param  {Function}  process a function which is passed { r, connection }, everything needed to interact with our Rethink DB
   * @return {Promise}
   */
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

/**
 * @type {PTTThink}
 */
module.exports = new PTTThink();
