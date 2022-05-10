const { Client  } = require('pg');

const db = new Client({
    user: 'postgres',
    host: '18.102.29.113',
    database: 'flagify',
    password: 'rootroot',
    port: 5555,
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
	text: 'INSERT INTO challenge(id, nome, testo, score, n_utenti_solv, flag) VALUES($1, $2, $3, $4, $5, $6)',
	values: [c.id, c.nome, c.testo, c.score, c.n_utenti_solv, c.flag]
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
    id : 5,
    nome : 'Prova da eliminare la vendetta',
    testo : 'In questa serie di sfide, chiamate challenge, verranno introdotti alcuni concetti fondamentali riguardo alle competizioni Capture The Flag (CTF), in particolare del formato jeopardy. In ogni challenge ti verrà richiesto di trovare un\'informazione segreta chiamata flag, sfruttando le vulnerabilità presenti all\'interno della sfida. Trovando ed inviando la flag alla piattaforma otterrai dei punti in base alla difficoltà della sfida che ti farà salire in classifica. \nPer questa primissima challenge invia questa flag nel campo qua sotto: \nflag{My_f1R57_54Ni7Y_ch3Ck}',
    score : 100,
    n_utenti_solv : 0,
    flag : 'flag{My_f1R57_54Ni7Y_ch3Ck}',
    url_image: 'templates/challenges/infinite-server.jpg',
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

// inserisciChallenge(db, challenge);
// eliminaChallenge(db, 1);
// modificaChallenge(db, challenge);
// inserisciUtenteChallenge(db, uc);

