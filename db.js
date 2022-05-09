const { Client  } = require('pg');
// const dbconfig = require('./dbconfig');

const db = new Client({
  user: 'postgres',
  host: '18.102.29.113',
  database: 'flagify',
  password: 'rootroot',
  port: 5555,
}); 

const chall = new Client({
  user: 'postgres',
  host: '18.102.20.113',
  database: 'challenge',
  password: 'rootroot',
  port: 5555,
});

exports.chall = chall;

exports.db = db;
