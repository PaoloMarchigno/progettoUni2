const { Client  } = require('pg');
// const dbconfig = require('./dbconfig');

const db = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'flagify',
  password: 'root',
  port: 5433,
}); 



exports.db = db;
