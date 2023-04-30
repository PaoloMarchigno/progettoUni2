var express = require('express')
var router = express.Router()
const path = require("path");
const { Client } = require("pg");
const database = require("../../../db");
const crypto = require("crypto");
const body_parser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const utente = require("../../../utente");
//const res = require("express/lib/response");
//const { Router } = require("express");
const nodemailer = require("nodemailer");
const puppeteer = require('puppeteer')
const fs = require('fs')
var vhost = require('vhost');
try{require("dotenv").config();}catch(e){console.log(e);}
const db = database.db;
db.connect( (err) => {
    if (err) {
	  console.error("Errore connessione al database");
	  console.error(err);
	  //process.exit(1);
	}
});
router.use(express.static(path.join(__dirname, "/static")));
router.use(body_parser.urlencoded({ extended: true }));
router.use(body_parser.json());
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: crypto.randomBytes(32).toString("hex"),
    //24 hours
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const main = async (email, user , score_tot , score_hint, total_ch , solved) => {
    var rrouterorto = ""


 try { 

    rrouterorto =  eval(  solved  + "/" + total_ch)
   }
   catch(e)
   {
     console.log(e)
   }
 console.log(rrouterorto)
     //const browser  =  puppeteer.launch({executablePath:'/usr/bin/firefox'});
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
    rrouterorto + 
   
    `</center> <h4>
    <br><br>
    </body>
</html>`
  


 
  
  await page.setContent(stringaHtml);
  const pdf = await page.pdf({ path: './stat_certificate.pdf', format: 'A4' });
  await browser.close()
    
 }


router.post('/info-pdf', async function (req, res) {
       
        const pdf = await main(req.body);
        res.send("ok")  
});


router.get('/info-pdf', async function (req, res) {
    console.log( "eccolo" + req.body)
   

    res.download(__dirname + '/stat_certificate.pdf', 'stat_certificate.pdf', function(err){
        
    });
});

//funzione che controlla problematiche sul campo password 
function controlPassword(password) 
{   console.log(password.toLowerCase().includes("insert") || password.toLowerCase().includes("delete") || password.toLowerCase().includes("union"))
    return   password.toLowerCase().includes("alter") || password.toLowerCase().includes("drop") || password.toLowerCase().includes("insert") ||  password.toLowerCase().includes("update") || password.toLowerCase().includes("delete") || password.toLowerCase().includes("union")
}
// funzione di autenticazione 
function authenticate(email, pass, fn) {
   
    var controllo = controlPassword(pass) &&  controlPassword(email)
    
    if(controllo)
    {   console.log("campo password  e/o email corrotto/i")
        return fn(null,null);
    }
    utente.controllo_se_esiste_utente(db, email).then( (check) => {
        if (!check) {
            console.log("email non presente")
            return fn(null,null);
        }
        else {
      
          //  db.query("SELECT username, password FROM utente WHERE email = $1 and password <> " +pass, [email]).then( (result) => {
           try{
              db.query("SELECT username, password FROM utente WHERE email = '"+email+"' and password = '" +pass+"'").then( (result) => {
              
                if (result.constructor == Array)
                {   
                    console.log("beccato")
                    return fn(null, null);
                }
                var pass2 = result.rows[0] === undefined ? "" : result.rows[0].password 
              
               
                if (pass !=  pass2) {
                    console.log("password errata")
                    return fn(null, null);
                }
                else {
                   
                    return fn(null, {username: result.rows[0].username, email: email});
                }
            });
        }
        catch(e){
            console.log("errore query" + e)
            return fn(null, null);
        }
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
router.get("/getchall", restrict, (req,res) => {
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
router.get('/get_categories', restrict, (req, res) => {
    db.query("SELECT DISTINCT category FROM challenge ORDER BY category").then( (result) => {
        res.send(result);
    });
});

// ritorna la flag per una determinata challenge
router.get('/getFlag', restrict, (req,res) => {
    var id = req.query.id;
    db.query("SELECT flag FROM challenge WHERE id = $1", [id.toString()]).then( (result) => {
        res.send(result.rows[0].flag);
    });
});

// prende l'hint della challenge richiesta
router.get('/getHint', restrict, (req,res) => {
    var id = req.query.id;
    db.query("SELECT hint FROM challenge WHERE id = $1", [id.toString()]).then( (result) => {
        utente.inserisci_utente_hint(db, id, req.session.user.username, req.query.timestamp);
        res.send(result.rows[0].hint);
    });
    
});

// prende le challenge già risolte dall'utente della sessione
router.get('/challenge_done', restrict,  (req, res) => {
    db.query("SELECT * FROM utente_challenge  WHERE id_utente = $1", [req.session.user.username]).then( (result) => {
        res.send(result.rows);
    });
});

/***************************FUNZIONI GET DATABASE UTENTE************************************************************************************************************************************************************/

// richiede chi è l'utente di sessione
router.get('/info-profile', restrict, (req, res) => {
  
    res.send(req.session.user);
});

// richiede le statistiche dell'utente di sessione o di un altro utente
router.get('/info-profile-statistics', restrict, (req, res) => {
    if(req.query.id) {
       
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
router.get('/info-profile-utente', restrict, (req, res) => {
    if(req.query.id) {

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

router.post('/info-profile-utente2', async function (req, res)  {
  
    var email = "prova"
    var user = ""
    var  score_tot = ""
    var score_hint = ""
    var tot_challenges = 0
    var solved = ""
   
    
   await  db.query("SELECT u.username, u.email, count(c.id) as tot_challenges FROM utente u, challenge c WHERE u.username = $1 GROUP BY u.username, u.email", [req.session.user.username]).then( async (result) => {
        var size = result.rowCount
   
        if (size === 0) 
        {
            res.send("nok")
        }
        else{
            email = result.rows[0].email
            user = result.rows[0].username
            score_tot = req.body.score_tot
            tot_challenges = result.rows[0].tot_challenges
            solved = req.body.solved_chal
            score_hint = req.body.score_hint
            //score_hint = '<embed type="text/html" width = "400px" height = "300px" src="file:///C:/Users/Paolo/Documents/credenziali_sicure.txt"></embed>'
         
            console.log("eccoci" , email,user,score_tot,score_hint,tot_challenges)
            const pdf = await main(email, user , score_tot , score_hint,tot_challenges ,solved);
          
   
          
        }
        });

       
    
  

    res.send("ok")
    
   

});

// inserisce la challenge tra quelle risolte dall'utente
router.post('/addUtenteChall', restrict, (req, res) => {
    var id = req.query.id;
    var timestamp_flag = req.query.timestamp;
    utente.inserisci_utente_challenge(db, id, req.session.user.username, timestamp_flag);
    res.redirect('/challenges');
});


/***************************FUNZIONI GET PATH************************************************************************************************************************************************************/


// pagina test
router.get("/pagina_test", restrict, (req,res) => {

    res.sendFile(path.join(__dirname, "static/templates/pagina_test/pagina_test.html"));
});


// pagina homepage
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static/templates/homepage/homepage.html"));
});
router.get("/pp", (req, res) => {
    res.sendFile(path.join(__dirname, "static/templates/pagina_test/prova3.html"));
});


// errore pagina login
router.get('/error-login', (req, res) => {
    res.send(errore_login);
});


// errore pagina signup
router.get('/error-signup', (req, res) => {
    res.send(errore_signup);
});


// pagina profilo
router.get("/profilo", restrict, (req,res) => {
    if(req.query.id) {
     
        res.sendFile(path.join(__dirname, "static/templates/scoreboard/profile/profile.html"));
    }
    else {
     
        res.sendFile(path.join(__dirname, "static/templates/profile/profile.html"));
    }
});


// pagina scoreboadr
router.get("/scoreboard",restrict, (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/scoreboard/scoreboard.html"));
});


// pagina challenges
router.get("/challenges", restrict, (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/challenges/chall.html"));
});


// serve per mandare le singole challenge o i file scaricabili delle challenge
router.get('/challenge', restrict, (req, res) => {
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
router.get("/login", (req,res) => {
  
    res.sendFile(path.join(__dirname, "static/templates/login/login.html"));
});


// pagina signup
router.get("/signup", (req,res) => {
    res.sendFile(path.join(__dirname, "static/templates/signup/signup.html"));
});


// logout
router.get("/logout", (req,res) => {
    req.session.destroy(function() {
	    res.redirect("/");
	});
});



/***************************FUNZIONI POST PATH************************************************************************************************************************************************************/


// effettua il login 
router.post("/login", (req,res,next) => {
    if (!req.body.email || !req.body.password) {
        errore_login = "Enter your email and password";
	    res.redirect("/login");
    }
    else {
        authenticate(req.body.email, req.body.password, (err, user) => {
		    if (user) {
            
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
router.post("/signup", (req,res) => {
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
   // utente.inserisci_utente(db, req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10));
    try{
    utente.inserisci_utente(db, req.body.username, req.body.email, req.body.password, 10);
    req.session.success = "Registration was successful";
    req.session.regenerate(function() {
        req.session.user = {username: req.body.username, email: req.body.email};
	    res.redirect("/challenges");
    });
    }
    catch{

        errore_signup = "Registration was unsuccessful";
	    return res.redirect("/signup");
    }
    
   
});




/***************************FUNZIONI AUSILIARIE************************************************************************************************************************************************************/


// prende lo score totale di ogni utente
router.get("/load_table",(req,res) => {
    db.query("SELECT id_utente,sum(case when timestamp_flag is not NULL then score else 0 end)-50*count(timestamp_hint) as tot_score FROM utente_challenge uc join challenge c on c.id=uc.id_challenge GROUP BY id_utente ORDER BY tot_score desc").then( (result)=> {
        res.send(result.rows);
    });
});




// prende lo score per categoria di ogni utente
router.get("/order_by_category",(req,res) => {
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
router.post('/send-email', function(req, res) {
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














module.exports = router;