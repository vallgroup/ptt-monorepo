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

    const self = this;
    return this.withConnection(async ({ r, connection }) => {
      try {
        const dbList = await r.dbList().run(connection);
        const { db } = self.config;

        if (!dbList.includes(db)) {
          const result = await r.dbCreate(db);

          const success = result.dbs_created === 1;

          if (!success) {
            throw Error(`Failed creating db ${db}`);
          }
        }

        // import classes here as part of the preperation process
        // so they can themselves import the prepared PTTThink object
        // and leverage its' functionality
        this.Model = require("./model");

        self.ready = true;
        return true;
      } catch (err) {
        console.warn("Error setting up database \n", err);
        self.ready = false;
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

    if (!(config && r)) {
      throw Error(
        "PTTThink must be prepared before trying to open a connection"
      );
    }

    try {
      connection = await r.connect(config);
      return await process({ r, connection });
    } catch (err) {
      console.warn("Failed running process with connection \n", err);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  async model(name, schema) {
    // model already created, retreive it
    if (this.models[name]) {
      return this.models[name];
    }

    // it's a new model, let's initiate one

    if (typeof name !== "string") {
      throw new Error("`PTTThink.model()` expected name param to be a string");
    }
    if (typeof schema !== "object") {
      throw new Error(
        "`PTTThink.model()` expected schema param to be an object defining a JOI schema"
      );
    }

    const model = new this.Model(name, schema);
    await model.init();

    this.models[name] = model;
    return this.models[name];
  }

  async tableList() {
    const self = this;
    return this.withConnection(async ({ r, connection }) => {
      return await r
        .db(self.config.db)
        .tableList()
        .run(connection);
    });
  }

  async tableCreate(name) {
    const self = this;
    return this.withConnection(async ({ r, connection }) => {
      return await r
        .db(self.config.db)
        .tableCreate(name)
        .run(connection);
    });
  }
}

/**
 * @type {PTTThink}
 */
module.exports = new PTTThink();
