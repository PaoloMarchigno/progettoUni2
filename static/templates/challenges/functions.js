 function getNameBtn(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("profilo").innerHTML = this.responseText;
        }
    };
    console.log("get_profilo");
    xhttp.open("GET", '/info-profile', true);
    xhttp.send();
 }

function owl_carousel(){
    $('.owl-carousel').owlCarousel({
        autoplay:true,
        autoplayhoverpause: true,
        autotimeout: 200,
        loop:true,
        margin:10,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            992:{
                items:2,
                nav:false
            },
            1200:{
                items:3,
                nav:true,
                loop:false
            }
        }
    });
}
function show_done_challenge() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const res = JSON.parse(this.responseText);
          for (var id of res){
            id = id.id_challenge.toString();
            var elem = document.getElementById(id);
            elem.style = "color: red";
          }
        }
    }
    xhttp.open("GET", "/challenge_done", true);
    xhttp.send();
}

function show_modal(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var result = JSON.parse(this.responseText).rows[0];
          console.log(result);
          document.getElementById("title").innerHTML = result.nome;
          document.getElementById("text").innerHTML = result.testo;
          
        }
    }
    xhttp.open("GET", "/getchall?id="+id, true);
    xhttp.send();
}


function show_cards(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          results = JSON.parse(this.responseText).rows;
        //   console.log(results);
          for (var result of results){
            //   console.log(result);
            var html_code = '<div class="ms-2 me-2 p-4"><div class="card" id=' + result.id.toString() + '><img src="'+ result.url_image+'" class="card-img-top"><div class="card-body"><h5 class="card-title">'+ result.nome +'</h5><p class="card-text">Challenge Description</p></div></div></div>'
            
            $(".owl-carousel").append(html_code);
          }
        }
    }
    xhttp.open("GET", "/getchall", false);
    xhttp.send();
    var card_list = document.getElementsByClassName('card');
    for(i=0;i<card_list.length;i++) {
        card_list[i].setAttribute('data-bs-toggle','modal');
        card_list[i].setAttribute('data-bs-target','#myModal');
    }                       
}