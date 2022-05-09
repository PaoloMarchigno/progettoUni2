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
    id : 1,
    nome : 'Infinite Server',
    testo : 'Questo server sembra avere molte pagine, sono sicuro che qualcuno arriverà alla fine... prima o poi. Indirizzo: http://infinite.challs.olicyber.it',
    score : 200,
    n_utenti_solv : 0,
    flag : 'flag{y0u_mu57_b3_4_r35lly_f457_cl1ck3r!}',
}

// inserisciChallenge(db, challenge);
// eliminaChallenge(db, 1);
// modificaChallenge(db, challenge);
