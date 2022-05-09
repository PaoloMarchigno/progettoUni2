const { Client  } = require('pg');
// const dbconfig = require('./dbconfig');

const db = new Client({
  user: 'postgres',
  host: '18.102.29.113',
  database: 'flagify',
  password: 'rootroot',
  port: 5555,
}); 



exports.db = db;
