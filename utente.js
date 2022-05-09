const { Client } = require('pg');

function inserisciUtente(client, username, email, password) {
    const query = {
	text: 'INSERT INTO utente(username, email, password, score) VALUES($1, $2, $3, 0)',
	values: [username, email, password]
    };
    client.query(query, (err, res) => {
	if (err) {
	    console.log(err.stack);
	} else {
	    console.log(res.rows);
	}
    });
}

async function controlloSeEsisteUtente(client, email) {
    try {
	    const query = {
	        text: 'SELECT * FROM utente WHERE email = $1',
	        values: [email]
	    };
	    var result = await client.query(query);
		return result.rows.length > 0;
    } catch (err) {
	    console.log(err.stack);
		process.exit(1);
    }
}

async function getPasshash(client, email) {
    try {
	    const query = {
	        text: 'SELECT password FROM utente WHERE email = $1',
	        values: [email]
	    };
	    var result = await client.query(query);
    } catch (err) {
	    console.log(err.stack);
		process.exit(1);
    }
    return result.rows[0].password;
}

exports.inserisciUtente = inserisciUtente;
exports.controlloSeEsisteUtente = controlloSeEsisteUtente;
exports.getPasshash = getPasshash;
