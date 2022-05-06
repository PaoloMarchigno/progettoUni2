const { Client  } = require('pg');
// const dbconfig = require('./dbconfig');

const db = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'flagify',
  password: 'Zephyrus3!',
  port: 5432,
}); // fewfew

exports.db = db;
