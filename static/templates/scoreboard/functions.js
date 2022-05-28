function get_scoreboard() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            var i = 1;
            console.log(res);
            for (user of res) {
                console.log(user.id_utente);
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

function order_by_category() {
    var cat = $('.form-select option:selected')[0].value;
    console.log(cat);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            var i = 1;
            console.log(res);
            $('.scoreboard_table').html("");
            for (user of res) {
                console.log(user.id_utente);
                var t ="<tr><td class='text-center'>"+i+"</td><td class='text-center'>"+user.tot_score+"</td><td class='text-center'><a href='/profilo?id='"+user.id_utente+">"+user.id_utente+"</a></td></tr>"
                $('.scoreboard_table').append(t);
                i++;
            }
        }
    }
        xhttp.open("GET", "/order_by_category?category="+cat,true);
        xhttp.send();
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

