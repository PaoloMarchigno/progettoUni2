function get_scoreboard() { /*******richiedo al db i nomi utenti,la posizione nella scoreboard e lo score 
                                    e li organizzo nella table scoreboard ******************************/
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            var i = 1;
            for (user of res) {
                var t ="<tr><td class='text-center'>"+i+"</td><td class='text-center'>"+user.tot_score+"</td><td class='text-center'><a href="+"'"+"/profilo?id="+user.id_utente+"'>"+user.id_utente+"</a></td></tr>"
                $('.scoreboard_table').append(t);
                i++;
            }
        }
    }
    xhttp.open("GET", '/load_table', false);
    xhttp.send();
}
get_scoreboard();

function order_by_category() {/***********aggiorna la scoreboard filtrando in base alla categoria
                                          e richiedendo gli stessi dati richiesti dalla funzione precedente */
    var cat = $('.form-select option:selected')[0].value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            var i = 1;
            console.log(res);
            $('.scoreboard_table').html("");
            for (user of res) {
                //le query lato server inviano la scoreboard già pronta devo soltanto mostrarla
                var t ="<tr><td class='text-center'>"+i+"</td><td class='text-center'>"+user.tot_score+"</td><td class='text-center'><a href='/profilo?id='"+user.id_utente+">"+user.id_utente+"</a></td></tr>"
                $('.scoreboard_table').append(t);
                i++;
            }
        }
    }
        xhttp.open("GET", "/order_by_category?category="+cat,true); 
        xhttp.send();
}

function getNameBtn(){ /********inserisce il nome dell'utente loggato nel bottone del profilo */
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

