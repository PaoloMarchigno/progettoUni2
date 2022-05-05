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
            db.query("SELECT password FROM utente WHERE email = $1", [email]).then( (result) => {
                if (!bcrypt.compareSync(pass, result.rows[0].password)) {
                    return fn(null, null);
                }
                else {
                    return fn(null, email);
                }
            });
	    }
    });
}


function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = "Access denied!";
    }
}


app.get("/profilo", restrict, (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/profile/profile.html"));
});

app.get("/login", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/login_2/login.html"));
});

app.post("/login", (req,res,next) => {
    if (!req.body.email || !req.body.password) {
        popup.alert({
            content: "Inserire email e password"
        });
	    req.session.error = "Inserire email e password";
	    res.redirect("/login");
    }
    else {
        authenticate(req.body.email, req.body.password, (err, user) => {
            //if (err) { return next(err); }
		    if (user) {
                req.session.regenerate(function(err) {
                    req.session.user = user;
				    req.session.success = "Login effettuato con successo";
				    res.redirect("/profilo");
				});   
			}
		    else {
                console.log('Errore email o password errati');
                res.append('form-error', 'Errore email o password errati');
		        req.session.error = "Email o password errati";
				res.redirect("/login");
                
			}
		});
	}
});


app.get("/signup", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/signup_2/signup.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static/templates/homepage/homepage.html"));
});

app.post("/signup", (req,res) => {
    if (!req.body.username  || !req.body.email || !req.body.password || !req.body.password2) {
	    req.session.error = "Compilare tutti i campi";
	    return res.redirect("/signup");
	}
	if (req.body.password !== req.body.password2) {
	    req.session.error = "Le password non coincidono";
	    return res.redirect("/signup");
	}
    const result = utente.controlloSeEsisteUtente(db, req.body.email);
    if (result == true) {
        req.session.error = "Utente già registrato";
	    return res.redirect("/signup");
    }
    utente.inserisciUtente(db, req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10));
    req.session.success = "Registrazione avvenuta con successo";
    req.session.regenerate(function() {
        req.session.user = req.body.email;
	    res.redirect("/profilo");
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
