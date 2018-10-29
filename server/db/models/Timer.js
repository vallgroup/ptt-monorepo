const Joi = require("joi");
const PTTThink = require("../../lib/PTTThink");
const { emitNewTimer } = require("../../socket/actions");

const timerSchema = new PTTThink.Schema({
  user: Joi.string()
    .alphanum()
    .required(),
  //
  start: Joi.func(),
  finish: Joi.func()
});

timerSchema.statics.createTimer = function({ user }) {
  const timer = {
    user,
    start: PTTThink.r.now()
  };

  this.validate(timer);

  return timer;
};

timerSchema.statics.insertOne = async function({ user }) {
  try {
    const result = await this.run(table => {
      const timer = this.createTimer({ user });

      return table.insert(timer);
    });

    if (result.inserted !== 1) {
      throw Error(`Failed to insert timer for user ${user}`);
    }

    return result.generated_keys[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};

async function listen(socket) {
  const connection = await require("../connection");

  try {
    const cursor = await r
      .table(TABLE_NAME)
      .changes()
      .run(connection);

    cursor.each((err, item) => {
      if (item && item.new_val) {
        emitNewTimer({ socket, item });
      }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

const Timer = PTTThink.model("timer", timerSchema);

module.exports = { Timer };
