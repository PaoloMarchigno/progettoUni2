const { Client  } = require('pg');

const db = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'flagify',
  password: 'ugotpostgresandthen?',
  port: 5432,
 
 
}); 

exports.db = db;

 //password: 'Prova@Prova@@12',