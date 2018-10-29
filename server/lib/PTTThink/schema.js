class Schema {
  constructor(joiSchema) {
    this.joiSchema = joiSchema;
    this.statics = {};
  }
}

module.exports = Schema;
