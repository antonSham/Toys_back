const knex = require("knex");
const config = require("../database/knexfile");

module.exports = knex(config[process.env.NODE_ENV] || config.development);