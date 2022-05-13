const { Client  } = require('pg');

const db = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'flagify',
    password: 'root',
    port: 5433,
  }); 

db.connect( (err) => {
    if (err) {
	  console.error("Errore connessione al database");
	  console.error(err);
	  //process.exit(1);
	}
});


function eseguiQuery(db, query){
    db.query(query, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows);
        }
        });
}

function inserisciChallenge(db, c) {
    const query = {
	text: 'INSERT INTO challenge(id, nome, testo, score, n_utenti_solv, flag, url_image, category, hint) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
	values: [c.id, c.nome, c.testo, c.score, c.n_utenti_solv, c.flag, c.url_image, c.category, c.hint]
    };
    eseguiQuery(db, query);
}

function modificaChallenge(db, c){
    eliminaChallenge(db, c.id);
    inserisciChallenge(db, c);
}

function eliminaChallenge(db, id){
    const query = {
        text: 'DELETE FROM challenge where id=$1',
        values: [id]
        };
    eseguiQuery(db, query);
}

var challenge ={   
    "id" : 5,
    "nome" : "Very strong Vigenere",
    "testo" : "Da quando ho scoperto vigenere mi sento completamente al sicuro! \nCiphertext: fzau{ncn_isors_cviovw_pwcqoze}",
    "score" : 100,
    "n_utenti_solv" : 0,
    "hint": "Utilizza il cifrario di Vigenere con una chiave di quattro lettere ",
    "flag" : "flag{non_usare_chiavi_piccole}",
    "url_image": "templates/challenges_2/rabbit.webp",
    "category": "cryptography"
}

var uc ={
    id_challenge : 2,
    id_utente : 'thomas',
    hint : 0,
    solved : true,
}


function inserisciUtenteChallenge(db, uc){
    const query = {
        text: 'INSERT INTO utente_challenge(id_challenge ,id_utente, hint, solved) VALUES($1, $2, $3, $4)',
        values: [uc.id_challenge ,uc.id_utente, uc.hint, uc.solved]
        };
        eseguiQuery(db, query);
}

//inserisciChallenge(db, challenge);
// eliminaChallenge(db, 1);
modificaChallenge(db, challenge);
// inserisciUtenteChallenge(db, uc);

