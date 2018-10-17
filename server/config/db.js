const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 32769
};

module.exports = dbConfig;
