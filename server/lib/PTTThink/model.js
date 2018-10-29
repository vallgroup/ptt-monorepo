const PTTThink = require("./");

class Model {
  constructor(name, schema) {
    this.name = name;

    /**
     * Uses JOI for the schema
     */
    this.schema = schema;
  }

  async init() {
    const tableList = await PTTThink.tableList();

    if (tableList.includes(this.name)) {
      return true;
    } else {
      const result = await PTTThink.tableCreate(this.name);
      return true;
    }
  }
}

module.exports = Model;
