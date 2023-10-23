const {Pool} = require("pg");

const pool = new Pool({
  user: "node",
  database: "urls",
  password: "password",
  port: 5432,
  host: "localhost"
});

module.exports = {pool};
