const setupServer = require("./setup");
const { appConfig } = require("./config");

async function runServer() {
  const app = await setupServer();
  const { port } = appConfig;

  app.listen(port, () => console.log(`App listening on port ${port}`));
}

runServer();
