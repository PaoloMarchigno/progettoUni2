function get_scoreboard() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            var i = 1;
            console.log(res);
            for (user of res) {
                console.log(user.id_utente);
                var t ="<tr><th scope='row'></th><td class='text-center'>"+i+"</td><td class='text-center'>"+user.tot_score+"</td><td class='text-center'>"+user.id_utente+"</td></tr>"
                $('.scoreboard_table').append(t);
                i++;
            }
        }
    }
    xhttp.open("GET", '/load_table', false);
    xhttp.send();
}
get_scoreboard();