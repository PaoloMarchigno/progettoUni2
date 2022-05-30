const { Client } = require('pg');

// inserisce utente nel database
function inserisci_utente(client, username, email, password) {
    const query = {
	text: 'INSERT INTO utente(username, email, password) VALUES($1, $2, $3)',
	values: [username, email, password]
    };
    client.query(query, (err, res) => {
	if (err) {
	    console.log(err.stack);
	}
    });
}

// controlla se esiste l'utente nel database
async function controllo_se_esiste_utente(client, email) {
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


// inserisce la challenge selezionata tra quelle risolte dall'utente
function inserisci_utente_challenge(db, id_challenge ,id_utente, timestamp_flag){
	check_utente_challenge(db, id_challenge ,id_utente).then((res) =>{
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

// inserisce l'hint utilizzata tra quelle risolte dall'utente
function inserisci_utente_hint(db, id_challenge, id_utente, timestamp_hint){
	check_utente_challenge(db, id_challenge ,id_utente).then((res) =>{
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

// controlla se un utente ha risolta una challenge
async function check_utente_challenge(db, id_challenge ,id_utente){
	const query = {
        text: 'SELECT * FROM utente_challenge WHERE id_challenge=$1 and id_utente=$2 ',
        values: [id_challenge ,id_utente]
        };
	var result = await db.query(query);
	return result.rows[0];
};


exports.inserisci_utente = inserisci_utente;
exports.controllo_se_esiste_utente = controllo_se_esiste_utente;
exports.inserisci_utente_challenge = inserisci_utente_challenge;
exports.check_utente_challenge = check_utente_challenge;
exports.inserisci_utente_hint = inserisci_utente_hint;