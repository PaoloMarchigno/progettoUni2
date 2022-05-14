const { Client } = require('pg');

function inserisciUtente(client, username, email, password) {
    const query = {
	text: 'INSERT INTO utente(username, email, password, score) VALUES($1, $2, $3, 0)',
	values: [username, email, password]
    };
    client.query(query, (err, res) => {
	if (err) {
	    console.log(err.stack);
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

function inserisciUtenteChallenge(db, id_challenge ,id_utente, timestamp_flag){
	checkUtenteChallenge(db, id_challenge ,id_utente).then((res) =>{
		if (res){
			var esiste_flag = res.timestamp_flag;
			var esiste_hint = res.timestamp_hint;
		}
		else{
			var esiste_flag = false;
			var esiste_hint = false;
		}
		if(esiste_flag){
			console.log("C'è stato un errore nell'invio della flag: flag già inserita per questo utente");
			return;
		}
		if (!esiste_hint){
			console.log("Inserisco utente: "+ id_utente + " timestamp_flag");
			const query = {
				text: 'INSERT INTO utente_challenge(id_challenge, id_utente, timestamp_hint, timestamp_flag) VALUES($1, $2, null, $3)',
				values: [id_challenge ,id_utente, timestamp_flag]
				};
			db.query(query, (err, res) => {
				if (err) {
					console.log(err.stack);
				} 
			});
		}else{
			console.log("Modifico utente: "+ id_utente + " timestamp_flag: "+timestamp_flag);
			const query = {
				text: 'UPDATE utente_challenge SET timestamp_flag=$3 WHERE id_challenge=$1 and id_utente=$2',
				values: [id_challenge ,id_utente, timestamp_flag]
				};
			db.query(query, (err, res) => {
				if (err) {
					console.log(err.stack);
				} 
			});
		}
	});
}

function inserisciUtenteHint(db, id_challenge, id_utente, timestamp_hint){
	checkUtenteChallenge(db, id_challenge ,id_utente).then((res) =>{
		if (res){
			var esiste_flag = res.timestamp_flag;
			var esiste_hint = res.timestamp_hint;
		}
		else{
			var esiste_flag = false;
			var esiste_hint = false;
		}
		if(esiste_hint){
			return;
		}
		if (!esiste_flag){
			console.log("Inserisco utente: "+ id_utente + " timestamp_hint");
			const query = {
				text: 'INSERT INTO utente_challenge(id_challenge, id_utente, timestamp_hint, timestamp_flag) VALUES($1, $2, $3, null)',
				values: [id_challenge ,id_utente, timestamp_hint]
				};
			db.query(query, (err, res) => {
				if (err) {
					console.log(err.stack);
				} 
			});
		}
		else{
			console.log("Modifico utente: "+ id_utente + " con timestamp_hint");
			const query = {
				text: 'UPDATE utente_challenge SET timestamp_hint=$3 WHERE id_challenge=$1 and id_utente=$2',
				values: [id_challenge ,id_utente, timestamp_hint]
				};
			db.query(query, (err, res) => {
				if (err) {
					console.log(err.stack);
				} 
			});
		}
	});
}

async function checkUtenteChallenge(db, id_challenge ,id_utente){
	const query = {
        text: 'SELECT * FROM utente_challenge WHERE id_challenge=$1 and id_utente=$2 ',
        values: [id_challenge ,id_utente]
        };
	var result = await db.query(query);
	return result.rows[0];
};


exports.inserisciUtente = inserisciUtente;
exports.controlloSeEsisteUtente = controlloSeEsisteUtente;
exports.getPasshash = getPasshash;
exports.inserisciUtenteChallenge = inserisciUtenteChallenge;
exports.checkUtenteChallenge = checkUtenteChallenge;
exports.inserisciUtenteHint = inserisciUtenteHint;