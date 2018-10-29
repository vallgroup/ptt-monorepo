const PTTThink = require("./");
const Joi = require("joi");

class Model {
  constructor(name, schema) {
    this.name = name;

    this.joiSchema = schema.joiSchema;
    this._applyStatics(schema.statics);

    this.ready = false;
  }

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

  validate(document) {
    const { error } = Joi.validate(document, this.joiSchema);

    if (error) {
      throw new Error(error);
    }

    return true;
  }

  /*
  PRIVATE FUNCTIONS
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

  _applyStatics(statics) {
    if (!statics) return;

    const self = this;

    Object.keys(statics).forEach(name => {
      if (typeof statics[name] === "function") {
        self[name] = statics[name].bind(self);
      }
    });
  }

  async _preCommand() {
    if (!this.ready) {
      await this._init();
    }
  }
}

module.exports = Model;
