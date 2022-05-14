const express = require("express");
const path = require("path");
const { Client } = require("pg");
const database = require("./db");
const crypto = require("crypto");
const body_parser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const utente = require("./utente");
const res = require("express/lib/response");
const { Router } = require("express");

const app = express();

const db = database.db;
db.connect( (err) => {
    if (err) {
	  console.error("Errore connessione al database");
	  console.error(err);
	  //process.exit(1);
	}
});


app.use(express.static(path.join(__dirname, "static")));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: crypto.randomBytes(32).toString("hex"),
    //24 hours
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(function(req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = "";
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

function authenticate(email, pass, fn) {
    utente.controlloSeEsisteUtente(db, email).then( (check) => {
        if (!check) {
            return fn(null,null);
        }
        else {
            db.query("SELECT username, password FROM utente WHERE email = $1", [email]).then( (result) => {
                if (!bcrypt.compareSync(pass, result.rows[0].password)) {
                    return fn(null, null);
                }
                else {
                    return fn(null, {username: result.rows[0].username, email: email});
                }
            });
	    }
    });
}

var errore_login = '';
var errore_signup = '';

function restrict(req, res, next) {
    req.session.user = {username: 'thomas', email: 'thomas.kirschner2901@gmail.com'};        // da togliere
    if (req.session.user) {
        next();
    } else {
        req.session.error = "Access denied!";
    }
}

app.get("/getchall", restrict, (req,res) => {
    const id =req.query.id;
    const category = req.query.category;
    if (id == undefined){
        db.query("SELECT * FROM challenge WHERE category=$1", [category]).then( (result) => {
            res.send(result);
        });
    }
    else{
        db.query("SELECT * FROM challenge WHERE id=$1", [id]).then( (result) => {
            res.send(result);
        });
    }
});

app.get('/get_categories', restrict, (req, res) => {
    db.query("SELECT DISTINCT category FROM challenge ").then( (result) => {
        res.send(result);
    });
});

app.get('/getFlag', restrict, (req,res) => {
    var id = req.query.id;
    db.query("SELECT flag FROM challenge WHERE id = $1", [id.toString()]).then( (result) => {
        res.send(result.rows[0].flag);
    });
});

app.get('/getHint', restrict, (req,res) => {
    var id = req.query.id;
    db.query("SELECT hint FROM challenge WHERE id = $1", [id.toString()]).then( (result) => {
        utente.inserisciUtenteHint(db, id, req.session.user.username, req.query.timestamp);
        res.send(result.rows[0].hint);
    });
    
});



app.post('/addUtenteChall', restrict, (req, res) => {
    var id = req.query.id;
    var timestamp_flag = req.query.timestamp;
    utente.inserisciUtenteChallenge(db, id, req.session.user.username, timestamp_flag);
    res.redirect('/challenges');
});


app.get('/info-profile', restrict, (req, res) => {
    res.send(req.session.user);
});


app.get('/challenge_done', restrict,  (req, res) => {
    req.session.user = {username: 'thomas', email: 'thomas.kirschner2901@gmail.com'};
    db.query("SELECT * FROM utente_challenge  WHERE id_utente = $1", [req.session.user.username]).then( (result) => {
        res.send(result.rows);
    });
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static/templates/homepage/homepage.html"));
});



app.get('/error-login', (req, res) => {
    res.send(errore_login);
});

app.get('/error-signup', (req, res) => {
    res.send(errore_signup);
});

app.get("/profilo", restrict, (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/profile/profile.html"));
});

app.get("/challenges", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/challenges/chall.html"));
});

app.get("/challenges_2", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/challenges/chall.html"));
});

app.get("/login", (req,res) => {
    console.log(errore_login);
    res.sendFile(path.join(__dirname, "static/templates/login/login.html"));
});

app.post("/login", (req,res,next) => {
    if (!req.body.email || !req.body.password) {
        errore_login = "Inserire email e password";
	    res.redirect("/login");
    }
    else {
        authenticate(req.body.email, req.body.password, (err, user) => {
            //if (err) { return next(err); }
		    if (user) {
                req.session.regenerate(function(err) {
                    req.session.user = user;
                    errore_login = '';
				    res.redirect("/challenges");
				});   
			}
		    else {
                errore_login = "Email o password errati";
				res.redirect("/login");
			}
		});
	}
});


app.get("/signup", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/signup/signup.html"));
});


app.post("/signup", (req,res) => {
    if (!req.body.username  || !req.body.email || !req.body.password || !req.body.password2) {
	    errore_signup = "Compilare tutti i campi";
	    return res.redirect("/signup");
	}
	if (req.body.password !== req.body.password2) {
	    errore_signup = "Le password non coincidono";
	    return res.redirect("/signup");
	}
    const result = utente.controlloSeEsisteUtente(db, req.body.email);
    if (result == true) {
        errore_signup = "Utente già registrato";
	    return res.redirect("/signup");
    }
    errore_signup = '';
    utente.inserisciUtente(db, req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10));
    req.session.success = "Registrazione avvenuta con successo";
    req.session.regenerate(function() {
        req.session.user = {username: req.body.username, email: req.body.email};
	    res.redirect("/challenges");
    });
});


app.get("/logout", (req,res) => {
    req.session.destroy(function() {
	res.redirect("/");
	});
});


// function ensureAuth(req, res, next) {
//   if (req.session.user) {
//     next();
//   } else {
//     return res.json(401, {error: 'user must be logged in.'});
//   }
// }

// app.get("/getUtente", ensureAuth, (req,res) => {
//     var email = req.session.user;
//     db.query("SELECT * FROM utenti WHERE email = $1", [email])
// 		.then(result => {
// 			res.status(200).json(result.rows);
// 		}).catch(e => { console.error(e.stack) });
// });


app.listen(8000, () => {
    console.log("Server is running on port 8000");
    console.log("http://localhost:8000");
});
