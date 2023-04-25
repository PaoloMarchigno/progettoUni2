var email = ""
var user = ""
var score_tot = ""
var score_hint = ""
var t_challenges = ""
var solved_chal = ""
function getStatisctics(){
    var score_flag_tot = 0;
    var score_hint_tot = 0;
    var total_score = 0;
    var n_solved_chal = 0;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            for (challenge of res){
                if (challenge.timestamp_flag){
                    var c = '<tr class="text-center"><td>' + challenge.timestamp_flag +'</td><td>'+challenge.nome+'</td><td>'+challenge.score+'</td></li>';
                    $(".table_challenge_flag").append(c);
                    score_flag_tot += challenge.score
                    n_solved_chal += 1;
                }
                if (challenge.timestamp_hint){
                    var c = '<tr class="text-center"><td>' + challenge.timestamp_hint +'</td><td>'+challenge.nome+'</td><td>-50</td></li>';
                    $(".table_challenge_hint").append(c);
                    score_hint_tot += 50;
                }
            }
            total_score = score_flag_tot-score_hint_tot;
            score_hint_tot = score_hint_tot/50;
            console.log(score_flag_tot, score_hint_tot, total_score);
        }
    };
    xhttp.open("GET", '/info-profile-statistics', false);
    xhttp.send();

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText)[0];
            console.log(res);
            email = res.email 
            user = res.user
            score_hint = score_hint_tot
            score_tot = score_flag_tot
            t_challenges =res.tot_challenges
            solved_chal = n_solved_chal
            $(".user-info").append('<tr><td>' + 'Username' +'</td><td>'+res.username+'</td></li>');
            $(".user-info").append('<tr><td>' + 'Email' +'</td><td>'+res.email+'</td></li>');
            $(".user-info").append('<tr><td>' + 'Challenge points' +'</td><td>'+score_flag_tot+'</td></li>');
            $(".user-info").append('<tr><td>' + 'Hint used' +'</td><td>'+score_hint_tot+'</td></li>');
            $(".user-info").append('<tr><td>' + 'Total score' +'</td><td>'+total_score+'</td></li>');
            $(".user-info").append('<tr><td>' + 'Solved challenges' +'</td><td>'+n_solved_chal+ "/" + res.tot_challenges+'</td></li>');
        }
    }
    xhttp2.open("GET", '/info-profile-utente', false);
    xhttp2.send();
 }

 function downloadStats() {
    var xhttp3 = new XMLHttpRequest();

   

    xhttp3.onreadystatechange = function() {
       
    
        console.log(this.responseText);
        if(this.responseText === "ok")
        {
            window.open('/info-pdf');
        }

    }
   
    xhttp3.open("POST", '/info-profile-utente2', false);
    var json = {email : "email" , user : "user" , score_tot : score_tot , score_hint : score_hint , solved_chal}
    console.log(json)
    xhttp3.setRequestHeader("Content-Type", "application/json");
    xhttp3.send(JSON.stringify(json));

 }

function getNameBtn(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("button_profile").innerHTML += JSON.parse(this.responseText).username;
        centra_nav();
        }
    };
    xhttp.open("GET", '/info-profile', true);
    xhttp.send();
 }  