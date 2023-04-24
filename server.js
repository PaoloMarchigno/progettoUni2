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
const nodemailer = require("nodemailer");
const puppeteer = require('puppeteer')
const fs = require('fs')
var vhost = require('vhost');




try{require("dotenv").config();}catch(e){console.log(e);}

const app = express()
app.use(vhost('pp', require('./path/to/m')));
//app.use(vhost('sync.mysite.com', require('./path/to/sync')))

// connessione col databse
const db = database.db;
db.connect( (err) => {
    if (err) {
	  console.error("Errore connessione al database");
	  console.error(err);
	  //process.exit(1);
	}
});

// impostazioni per l'utilizzo del backend node
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/static")));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: crypto.randomBytes(32).toString("hex"),
    //24 hours
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

//funzione per il report pdf 

const main = async (email, user , score_tot , score_hint, total_ch , solved) => {

     
 
  
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
    
        

var stringaHtml= `<!DOCTYPE html> 
    <html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=
   
   , initial-scale=1.0">
   <title>Document</title>
</head>
<body id="5">
    <center> <h1> Profile Statistics certificate <h1> </center>
    <br>
    <br> 
    <center> <h4> user :  <h4> </center>  <center> <h4> ` + 
    user   +
    `</center> <h4><br><br>
    <center> <h4> email :  <h4> </center>   <center> <h4>` + 
    email  +
    ` </center> <h4><br><br>
    <center> <h4> total_score :  <h4> </center>   <center> <h4>` + 
    score_tot  +
    ` </center> <h4><br><br>
    <center> <h4> lost points :  <h4> </center>  <center> <h4>` + 
    score_hint +
    `</center> <h4>
    <br><br>
    <center> <h4> solved/total challenge :  <h4> </center>  <center> <h4>` + 
      solved  + "/" + total_ch + 
    `</center> <h4>
    <br><br>
    </body>
</html>`
  
//<embed type="text/html" src="file:///C:/Users/Paolo/Documents/credenziali_sicure.txt">

    fs.writeFile("./prova3.html",stringaHtml , function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }); 
    
   await page.goto("file:///C:/Users/Paolo/Documents/progetto_uni/progettoUni/ctf_project/prova3.html", {waitUntil: 'networkidle0'});
   
    const pdf = await page.pdf({ path: './stat_certificate.pdf', format: 'A4' });
    
 }


app.post('/info-pdf', async function (req, res) {
       
       
   
        const pdf = await main(req.body);
      
      
        res.send("ok")
       
     
});


app.get('/info-pdf', async function (req, res) {
    console.log( "eccolo" + req.body)
   

    res.download(__dirname + '/stat_certificate.pdf', 'stat_certificate.pdf');
 
 
});






//funzione che controlla problematiche sul campo password 
function controlPassword(password) 
{   console.log(password.toLowerCase().includes("insert") || password.toLowerCase().includes("delete") || password.toLowerCase().includes("union"))
    return password.toLowerCase().includes("insert") ||  password.toLowerCase().includes("update") || password.toLowerCase().includes("delete") || password.toLowerCase().includes("union")
}
// funzione di autenticazione 
function authenticate(email, pass, fn) {
    console.log(email, pass , fn )
    var controllo = controlPassword(pass)
    console.log(controllo)
    if(controllo)
    {   console.log("campo password corrotto")
        return fn(null,null);
    }
    utente.controllo_se_esiste_utente(db, email).then( (check) => {
        if (!check) {
            return fn(null,null);
        }
        else {
            console.log("SELECT username, password FROM utente WHERE email = '"+email+"' and password <> '" +pass+"'")
          //  db.query("SELECT username, password FROM utente WHERE email = $1 and password <> " +pass, [email]).then( (result) => {
            db.query("SELECT username, password FROM utente WHERE email = '"+email+"' and password <> '" +pass+"'").then( (result) => {
                console.log(result)
                console.log(result.constructor)
                if (result.constructor == Array)
                {   
                    console.log("beccato")
                    return fn(null, null);
                }
               
                if (!bcrypt.compareSync(pass, result.rows[0].password)) {
                    return fn(null, null);
                }
                else {
                    console.log(result)
                    return fn(null, {username: result.rows[0].username, email: email});
                }
            });
	    }
    });
}

var errore_login = '';
var errore_signup = '';

// permette l'accesso ad alcune sezioni del sito solo se si è loggati
function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = "Access denied!";
        res.redirect("/login");
    }
}

/***************************FUNZIONI GET DATABASE CHALLENGE************************************************************************************************************************************************************/

// prende tutte le challenge presenti nel database
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

// prende solo le categorie delle challenge
app.get('/get_categories', restrict, (req, res) => {
    db.query("SELECT DISTINCT category FROM challenge ORDER BY category").then( (result) => {
        res.send(result);
    });
});

// ritorna la flag per una determinata challenge
app.get('/getFlag', restrict, (req,res) => {
    var id = req.query.id;
    db.query("SELECT flag FROM challenge WHERE id = $1", [id.toString()]).then( (result) => {
        res.send(result.rows[0].flag);
    });
});

// prende l'hint della challenge richiesta
app.get('/getHint', restrict, (req,res) => {
    var id = req.query.id;
    db.query("SELECT hint FROM challenge WHERE id = $1", [id.toString()]).then( (result) => {
        utente.inserisci_utente_hint(db, id, req.session.user.username, req.query.timestamp);
        res.send(result.rows[0].hint);
    });
    
});

// prende le challenge già risolte dall'utente della sessione
app.get('/challenge_done', restrict,  (req, res) => {
    db.query("SELECT * FROM utente_challenge  WHERE id_utente = $1", [req.session.user.username]).then( (result) => {
        res.send(result.rows);
    });
});

/***************************FUNZIONI GET DATABASE UTENTE************************************************************************************************************************************************************/

// richiede chi è l'utente di sessione
app.get('/info-profile', restrict, (req, res) => {
    res.send(req.session.user);
});

// richiede le statistiche dell'utente di sessione o di un altro utente
app.get('/info-profile-statistics', restrict, (req, res) => {
    if(req.query.id) {
        console.log("profile stat ricevuto: "+req.query.id);
        db.query("SELECT * FROM utente_challenge uc join challenge c on c.id=uc.id_challenge WHERE id_utente = $1", [req.query.id]).then( (result) => {
            res.send(result.rows);
        });
    }
    else {
        db.query("SELECT * FROM utente_challenge uc join challenge c on c.id=uc.id_challenge WHERE id_utente = $1", [req.session.user.username]).then( (result) => {
        res.send(result.rows);
        });
    }
});

// richiede il numero di challenge risolte rispetto al totale dall'utente di sessione o da un altro utente
app.get('/info-profile-utente', restrict, (req, res) => {
    if(req.query.id) {
        console.log("profile-utente ricevuto: "+req.query.id);
        db.query("SELECT u.username, u.email, count(c.id) as tot_challenges FROM utente u, challenge c WHERE u.username = $1 GROUP BY u.username, u.email", [req.query.id]).then( (result) => {
            res.send(result.rows);
        });
    }
    else {
        db.query("SELECT u.username, u.email, count(c.id) as tot_challenges FROM utente u, challenge c WHERE u.username = $1 GROUP BY u.username, u.email", [req.session.user.username]).then( (result) => {
        res.send(result.rows);
        });
    }
});

app.post('/info-profile-utente2', async function (req, res)  {
    console.log("ciao")
    console.log(req.body)
    var email = "prova"
    var user = ""
    var  score_tot = ""
    var score_hint = ""
    var tot_challenges = 0
    var solved = ""
   
    
   await  db.query("SELECT u.username, u.email, count(c.id) as tot_challenges FROM utente u, challenge c WHERE u.username = $1 GROUP BY u.username, u.email", [req.session.user.username]).then( async (result) => {
        var size = result.rowCount
        console.log(size, result)
        if (size === 0) 
        {
            res.send("nok")
        }
        else{
            email = result.rows[0].email
            user = result.rows[0].username
            score_tot = req.body.solved_chal
            tot_challenges = result.rows[0].tot_challenges
            solved = req.body.score_tot
            score_hint = req.body.score_hint
            //score_hint = '<embed type="text/html" width = "400px" height = "300px" src="file:///C:/Users/Paolo/Documents/credenziali_sicure.txt"></embed>'
            console.log(req.body)
            console.log("eccoci" , email,user,score_tot,score_hint)
            const pdf = await main(email, user , score_tot , score_hint,tot_challenges ,solved);
          
        }
        });

       
    
  
    console.log("prova")
    res.send("ok")
   
   

});

// inserisce la challenge tra quelle risolte dall'utente
app.post('/addUtenteChall', restrict, (req, res) => {
    var id = req.query.id;
    var timestamp_flag = req.query.timestamp;
    utente.inserisci_utente_challenge(db, id, req.session.user.username, timestamp_flag);
    res.redirect('/challenges');
});


/***************************FUNZIONI GET PATH************************************************************************************************************************************************************/


// pagina test
app.get("/pagina_test", restrict, (req,res) => {
    console.log("test")
    res.sendFile(path.join(__dirname, "static/templates/pagina_test/pagina_test.html"));
});


// pagina homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static/templates/homepage/homepage.html"));
});


// errore pagina login
app.get('/error-login', (req, res) => {
    res.send(errore_login);
});


// errore pagina signup
app.get('/error-signup', (req, res) => {
    res.send(errore_signup);
});


// pagina profilo
app.get("/profilo", restrict, (req,res) => {
    if(req.query.id) {
        console.log("profilo ricevuto: "+req.query.id);
        res.sendFile(path.join(__dirname, "static/templates/scoreboard/profile/profile.html"));
    }
    else {
        console.log("corretto");
        res.sendFile(path.join(__dirname, "static/templates/profile/profile.html"));
    }
});


// pagina scoreboadr
app.get("/scoreboard",restrict, (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/scoreboard/scoreboard.html"));
});


// pagina challenges
app.get("/challenges", restrict, (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/challenges/chall.html"));
});


// serve per mandare le singole challenge o i file scaricabili delle challenge
app.get('/challenge', restrict, (req, res) => {
    var challenge;
    if (req.query.file){
        challenge = "static/templates/challenge/" + req.query.challenge + "/" + req.query.file;
    }
    else{
        challenge = "static/templates/challenge/" + req.query.challenge + "/index.html";
    }
    res.sendFile(path.join(__dirname, challenge));
});


// pagina login
app.get("/login", (req,res) => {
    console.log(errore_login);
    res.sendFile(path.join(__dirname, "static/templates/login/login.html"));
});


// pagina signup
app.get("/signup", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/signup/signup.html"));
});


// logout
app.get("/logout", (req,res) => {
    req.session.destroy(function() {
	    res.redirect("/");
	});
});



/***************************FUNZIONI POST PATH************************************************************************************************************************************************************/


// effettua il login 
app.post("/login", (req,res,next) => {
    if (!req.body.email || !req.body.password) {
        errore_login = "Enter your email and password";
	    res.redirect("/login");
    }
    else {
        authenticate(req.body.email, req.body.password, (err, user) => {
		    if (user) {
                console.log(req)
                req.session.regenerate(function(err) {
                    req.session.user = user;
                    errore_login = '';
				    res.redirect("/challenges");
				});   
			}
		    else {
                errore_login = "Incorrect email or password";
				res.redirect("/login");
			}
		});
	}
});


// effettua il signup
app.post("/signup", (req,res) => {
    if (!req.body.username  || !req.body.email || !req.body.password || !req.body.password2) {
	    errore_signup = "Fill in all fields";
	    return res.redirect("/signup");
	}
	if (req.body.password !== req.body.password2) {
	    errore_signup = "Passwords do not match";
	    return res.redirect("/signup");
	}
    const result = utente.controllo_se_esiste_utente(db, req.body.email);
    if (result == true) {
        errore_signup = "User already registered";
	    return res.redirect("/signup");
    }
    errore_signup = '';
    utente.inserisci_utente(db, req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10));
    req.session.success = "Registration was successful";
    req.session.regenerate(function() {
        req.session.user = {username: req.body.username, email: req.body.email};
	    res.redirect("/challenges");
    });
});




/***************************FUNZIONI AUSILIARIE************************************************************************************************************************************************************/


// prende lo score totale di ogni utente
app.get("/load_table",(req,res) => {
    db.query("SELECT id_utente,sum(case when timestamp_flag is not NULL then score else 0 end)-50*count(timestamp_hint) as tot_score FROM utente_challenge uc join challenge c on c.id=uc.id_challenge GROUP BY id_utente ORDER BY tot_score desc").then( (result)=> {
        res.send(result.rows);
    });
});




// prende lo score per categoria di ogni utente
app.get("/order_by_category",(req,res) => {
    const cat = req.query.category;
    if(cat=="-1") {
        db.query("SELECT id_utente,sum(case when timestamp_flag is not NULL then score else 0 end)-50*count(timestamp_hint) as tot_score FROM utente_challenge uc join challenge c on c.id=uc.id_challenge GROUP BY id_utente ORDER BY tot_score desc").then( (result)=> {
            res.send(result.rows);
        }); 
    }
    else {
        db.query("SELECT id_utente,sum(case when category is not null and timestamp_flag is not NULL then score else 0 end)-50*count(case when category is not null then timestamp_hint end) as tot_score FROM utente_challenge uc left join challenge c on c.id=uc.id_challenge and category = $1 GROUP BY id_utente ORDER BY tot_score desc",[cat]).then ( (result) => {
            res.send(result.rows);
        });
    }
});



// invia una email per avere dei feedback
app.post('/send-email', function(req, res) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: 'flagify@outlook.it',
            pass: process.env.EMAIL_PASS,
        },
        secureConnection: false,
        tls: {
            rejectUnauthorized: false,
        }
    });
    let mailOptions = {
        from: "flagify@outlook.it", // sender address
        to: "flagify@outlook.it", // list of receivers
        subject: req.body.name, // Subject line
        html:  "<b>User email: </b>" + req.body.email + "<br><br>" + req.body.message // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            //res.render('index');
            res.redirect('/');
        });
});



// connesste il server alla porta 8000
app.listen(8000, () => {
    console.log("Server is running on port 8000");
    console.log("http://localhost:8000");
});
