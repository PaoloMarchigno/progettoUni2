const { Client  } = require('pg');
// const dbconfig = require('./dbconfig');

const db = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'flagify',
  password: 'root',
  port: 5433,
}); // fewfew

const chall = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'challenges',
  password: 'root',
  port: 5433,
});

exports.chall = chall;

exports.db = db;
