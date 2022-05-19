const { Client  } = require('pg');

const db = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'flagify',
    password: 'Zephyrus3!',
    port: 5432,
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
    "id" : 7,
    "nome" : "Just get credentials",
    "testo" : 'Abbiamo trovato questo sito dove bisogna inserire le credenziali, riesci a trovarle? \n<a href="/challenge?challenge=just_get_credential" target="_blank">Just get Credential</a>',
    "score" : 100,
    "n_utenti_solv" : 0,
    "hint": "Magari i file JavaScript possono aiutare",
    "flag" : "flag{d0n7_u53_cl13n7_51d3_ch3ck5!!}",
    "url_image": "",
    "category": "Web Security"
}

var uc ={
    id_challenge : 2,
    id_utente : 'thomas',
    has_hint : false,
    solved : true,
    timestamp: '',
}


function inserisciUtenteChallenge(db, uc){
    const query = {
        text: 'INSERT INTO utente_challenge(id_challenge ,id_utente, has_hint, solved, timestamp) VALUES($1, $2, $3, $4, $5)',
        values: [uc.id_challenge ,uc.id_utente, uc.has_hint, uc.solved, uc.timestamp]
        };
        eseguiQuery(db, query);
}

const query = {text: 'DELETE FROM utente_challenge'}
 eseguiQuery(db, query);

// inserisciChallenge(db, challenge);
// eliminaChallenge(db, 1);
// modificaChallenge(db, challenge);
// inserisciUtenteChallenge(db, uc);

