// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// module.exports = {

require("dotenv").config();

module.exports = {
  development: {
    client: "postgres",
    connection: {
      host: process.env.DB_HOST,
      port: 5432,
      user: 'postgres',
      password: 'a1a2a3a4',
      database: 'toyyy',
    },
    seeds: {
      directory: "./seeds",
    },
  },
  test: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      tableName: "migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
