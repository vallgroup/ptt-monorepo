const next = require("next");
const { appConfig } = require("../config");

async function setupNext() {
  require("isomorphic-fetch");
  const { clientDir, isDev } = appConfig;

  const nextApp = next({ dir: clientDir, dev: isDev });
  const handler = nextApp.getRequestHandler();

  await nextApp.prepare();

  return { handler, nextApp };
}

module.exports = setupNext;
