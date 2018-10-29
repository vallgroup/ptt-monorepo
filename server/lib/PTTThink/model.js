const PTTThink = require("./");
const Joi = require("joi");

class Model {
  /**
   * Create a model using the passed schema.
   *
   * The table is not created here, but in the Model.init() function
   * which will only be called when it is first needed
   *
   * This constructor should never be called directly, but via PTTThink.model()
   *
   * @param {String} name    name corresponding to the name of the table the model will respresent
   * @param {PTTThink.Schema} schema
   */
  constructor(name, schema) {
    this.name = name;

    this.joiSchema = schema.joiSchema;
    this._applyStatics(schema.statics);

    this.ready = false;
  }

  /**
   * This should be used to run every command on a given model.
   *
   * It ensures the pre command checks have completed,
   * that the table is properly set up and configered,
   * and that the db connection is unique to this command
   *
   * It automatically builds the 'r.table('exmaple')' part of the query for us
   * (so we can avoid passing the table name string around the app)
   * and passes it to the command function as a 'table' param.
   *
   * We also pass the instance of r to avoid the need to reimport
   *
   * We then use the connection instance we get from PTTThink.withConnection
   * to run the command.
   *
   * eg
   *
   * exampleSchema.statics.insert = async function() {
   *
   *  ...
   *
   *  const result = this.run(table => {
   *    return table.insert({ name: 'example' }).plus().any().other().rethinkQL().functions()
   *  })
   * }
   *
   * @param  {Function}  command A function that takes (table, r) as args
   * @return {Promise}           Will resolve to the result of the command once it has run
   */
  async run(command) {
    const self = this;

    if (typeof command !== "function") {
      throw Error("Model.run expected passed command param to be a function");
    }

    await this._preCommand();

    return PTTThink.withConnection(async ({ r, connection }) => {
      const table = r.table(self.name);
      return await command(table, r).run(connection);
    });
  }

  /**
   * Use this function to validate a document against the Joi schema.
   *
   * Will throw an error if validation fails.
   *
   * @param  {Object} document A document to check
   * @return {Boolean}         If validation is passed, true will be returned. Else an error will be thrown.
   */
  validate(document) {
    const { error } = Joi.validate(document, this.joiSchema);

    if (error) {
      throw new Error(error);
    }

    return true;
  }

  /*
   *
   *
   * PRIVATE FUNCTIONS
   *
   *
   */

  /**
   * Prepares the db for the model, creating a new table if necessary
   *
   * @return {Promise}
   */
  async _init() {
    try {
      const tableList = await PTTThink.tableList();

      if (!tableList.includes(this.name)) {
        const result = await PTTThink.tableCreate(this.name);

        const success = result.tables_created === 1;

        if (!success) {
          throw Error(`Failed to create table for ${this.name}`);
        }
      }

      this.ready = true;
    } catch (err) {
      console.warn(`Failed to initialise ${this.name} model \n`, err);
      this.ready = false;
    }
  }

  /**
   * Bind the statics on the schema object to the model instance
   *
   * @param  {Object} statics Should be an object where the values are functions
   * @return {void}
   */
  _applyStatics(statics) {
    if (!statics) return;

    const self = this;

    Object.keys(statics).forEach(name => {
      if (typeof statics[name] === "function") {
        self[name] = statics[name].bind(self);
      }
    });
  }

  /**
   * Runs before any command is run on the model's respective db table.
   *
   * Currently used to check that the db table is set up and ready to receive documents
   *
   * @return {Promise}
   */
  async _preCommand() {
    if (!this.ready) {
      await this._init();
    }
  }
}

module.exports = Model;
