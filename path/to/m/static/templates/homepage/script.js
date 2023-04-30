function getNameBtn(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText == null);
            var utente = null;
            try{
                utente = JSON.parse(this.responseText).username;
            }catch(e){

            }
            console.log(utente);
            if (utente){
                $('#btn_form')[0].innerHTML = '<a href="/profilo" id="button_profile" class=" btn btn-success btn-sm rounded-pill"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill pb-1" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>'+JSON.parse(this.responseText).username+'</a><a href="/logout" class="btn btn-danger btn-sm rounded-pill ms-2" aria-labelledby="logout-popup"><title id="logout-popup">Logout</title><i class="fa fa-sign-out"></i></a>';
            }
            else{
                $('#btn_form')[0].innerHTML = '<a href="/login" id="button_profile" class=" btn btn-prime btn-sm rounded-pill" style="margin-right: 7px;">Login</a><a href="/signup" class="btn btn-prime btn-sm rounded-pill" style="margin-right: 6px;" aria-labelledby="logout-popup"><title id="logout-popup">Logout</title>Signup</a>';
            }
        centra_nav();
        }
    };
    xhttp.open("GET", 'info-profile', false);
    xhttp.send();
 }  