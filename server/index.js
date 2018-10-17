const setupServer = require("./setup");
const { appConfig } = require("./config");

async function runServer() {
  const app = await setupServer();
  const { port } = appConfig;

  const server = app.listen(port, () =>
    console.log(`App listening on port ${port}`)
  );

  require("./socket")(server);
}

runServer();
