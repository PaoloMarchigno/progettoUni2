var c = document.getElementById("c");
    var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),

minDist = 10,
maxDist = 30,
initialWidth = 10,
maxLines = 100,
initialLines = 4,
speed = 3,

lines = [],
frame = 0,
timeSinceLast = 0,

dirs = [
// straight x, y velocity
  [ 0, 1 ],
  [ 1, 0 ],
  [ 0, -1 ],
    [ -1, 0 ],
// diagonals, 0.7 = sin(PI/4) = cos(PI/4)
  [ .7, .7 ],
  [ .7, -.7 ],
  [ -.7, .7 ],
  [ -.7, -.7]
],
starter = { // starting parent line, just a pseudo line
  
  x: w / 2,
  y: h / 2,
  vx: 0,
  vy: 0,
  width: initialWidth
};

function init() {

  lines.length = 0; 

  for( var i = 0; i < initialLines; ++i )
    lines.push( new Line( starter ) );

  ctx.fillStyle = '#222';
  ctx.fillRect( 0, 0, w, h );

  // if you want a cookie ;)
  // ctx.lineCap = 'round';
}
function getColor( x ) {

  return 'hsl( hue, 80%, 50% )'.replace(
      'hue', x / w * 360 + frame
  );
}
function anim() {

  window.requestAnimationFrame( anim );

  ++frame;

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0,0,0,.02)';
  ctx.fillRect( 0, 0, w, h );
  ctx.shadowBlur = .5;

  for( var i = 0; i < lines.length; ++i ) 

    if( lines[ i ].step() ) { // if true it's dead

      lines.splice( i, 1 );
      --i;

    }

  // spawn new

  ++timeSinceLast

  if( lines.length < maxLines && timeSinceLast > 10 && Math.random() < .5 ) {

    timeSinceLast = 0;

    lines.push( new Line( starter ) );

    // cover the middle;
    ctx.fillStyle = ctx.shadowColor = getColor( starter.x );
    ctx.beginPath();
    ctx.arc( starter.x, starter.y, initialWidth, 0, Math.PI * 2 );
    ctx.fill();
  }
}

function Line( parent ) {

  this.x = parent.x | 0;
  this.y = parent.y | 0;
  this.width = parent.width / 1.25;

  do {

    var dir = dirs[ ( Math.random() * dirs.length ) |0 ];
    this.vx = dir[ 0 ];
    this.vy = dir[ 1 ];

  } while ( 
    ( this.vx === -parent.vx && this.vy === -parent.vy ) || ( this.vx === parent.vx && this.vy === parent.vy) );

  this.vx *= speed;
  this.vy *= speed;

  this.dist = ( Math.random() * ( maxDist - minDist ) + minDist );

}
Line.prototype.step = function() {

  var dead = false;

  var prevX = this.x,
      prevY = this.y;

  this.x += this.vx;
  this.y += this.vy;

  --this.dist;

  // kill if out of screen
  if( this.x < 0 || this.x > w || this.y < 0 || this.y > h )
    dead = true;

  // make children :D
  if( this.dist <= 0 && this.width > 1 ) {

    // keep yo self, sometimes
    this.dist = Math.random() * ( maxDist - minDist ) + minDist;

    // add 2 children
    if( lines.length < maxLines ) lines.push( new Line( this ) );
    if( lines.length < maxLines && Math.random() < .5 ) lines.push( new Line( this ) );

    // kill the poor thing
    if( Math.random() < .2 ) dead = true;
  }

  ctx.strokeStyle = ctx.shadowColor = getColor( this.x );
  ctx.beginPath();
  ctx.lineWidth = this.width;
  ctx.moveTo( this.x, this.y );
  ctx.lineTo( prevX, prevY );
  ctx.stroke();

  if( dead ) return true
}

init();
anim();

window.addEventListener( 'resize', function() {

  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  starter.x = w/2 ;
  starter.y = h/2;

  init();
} )


// inserisce il nome dell'utente loggato nel pulsante del profilo

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

// cambia il colore delle challenge già risolte dall'utente loggato

function show_done_challenge() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      
        if (this.readyState == 4 && this.status == 200) {
          const res = JSON.parse(this.responseText);
          for (var r of res){
            id = r.id_challenge.toString();
            if (r.timestamp_flag != null){
                $("div[id="+id+"]").attr("solved", 'true');
            }
            if (r.timestamp_hint != null){
                $("div[id="+id+"]").attr("hint", 'true');
            }
          }
        }
    }
    xhttp.open("GET", "/challenge_done", false);
    xhttp.send();
}

// mostra il popup per la conferma della richiesta dell'hint

function show_modal_hint(){
    
    $(".hint-title").text("Unlock Hint");
    $(".hint-body").text("Do you really want to unlock the hint?");
    $(".btn-success-hint" ).attr("style", "display: block;"); 
}

// inserisce il testo della challenge scelta nel modal

function show_modal(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var result = JSON.parse(this.responseText).rows[0];
          document.getElementById("title").innerHTML = result.nome;
          document.getElementById("text").innerHTML = result.testo;
          var score_text = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trophy" class="svg-inline--fa fa-trophy fa-w-18 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 35.7 22.5 72.4 61.9 100.7 31.5 22.7 69.8 37.1 110 41.7C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6c40.3-4.6 78.6-19 110-41.7 39.3-28.3 61.9-65 61.9-100.7V88c0-13.3-10.7-24-24-24zM99.3 192.8C74.9 175.2 64 155.6 64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-15.1-5.2-29.2-12.4-41.7-21.4zM512 144c0 16.1-17.7 36.1-35.3 48.8-12.5 9-26.7 16.2-41.8 21.4 7-25 11.8-53.6 12.8-86.2H512v16z"></path></svg> ' +result.score.toString();
          document.getElementById("score").innerHTML = score_text;
          document.getElementById('btn_flag').setAttribute('idd', result.id);
          document.getElementById('alert-success').style.display= "none";
          document.getElementById('alert-already-success').style.display= "none";
          document.getElementById('alert-danger').style.display= "none";
          document.getElementById("hint_btn").setAttribute('data-bs-toggle','modal');
          document.getElementById("hint_btn").setAttribute('data-bs-target','#modalHint');
          if($('div[id='+ result.id+']').attr("hint") == "true"){
                document.getElementById('hint_btn').style.backgroundColor = "#28a745";
                document.getElementById('hint_btn').style.borderColor = "#28a745";
                $('button[id="hint_btn"]').attr("onclick", "show_modal_hint();confirmHint();");
          }
          else{
            document.getElementById('hint_btn').style.backgroundColor = "#dc3545";
            document.getElementById('hint_btn').style.borderColor = "#dc3545";
            $('button[id="hint_btn"]').attr("onclick", "show_modal_hint();");
          }
        }
    }
    xhttp.open("GET", "/getchall?id="+id, true);
    xhttp.send();
}


// mostra tutte le card delle challenge presenti nel database

function show_all_cards(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var results = JSON.parse(this.responseText).rows;
          console.log(results); 
          for (var result of results){
              var html_code = '<div class="text-center mt-5"><h1>'+result.category+'</h1></div><div class="container mt-3"><div class="owl-carousel-'+result.category+' owl-carousel owl-theme"></div></div>';
            $(".div_nav").append(html_code);
            show_cards(result.category);  
          }
          var card_list = document.getElementsByClassName('card');
            for(i=0;i<card_list.length;i++) {
                  card_list[i].setAttribute('data-bs-toggle','modal');
                  card_list[i].setAttribute('data-bs-target','#myModal');
            }         
        }          
    }
    xhttp.open("GET", "/get_categories", false);
    xhttp.send();
}

// inserisce le card per le challenge di una determinata categoria

function show_cards(category){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var results = JSON.parse(this.responseText).rows; 
          for (var result of results){
            var score_text = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trophy" class="svg-inline--fa fa-trophy fa-w-18 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 35.7 22.5 72.4 61.9 100.7 31.5 22.7 69.8 37.1 110 41.7C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6c40.3-4.6 78.6-19 110-41.7 39.3-28.3 61.9-65 61.9-100.7V88c0-13.3-10.7-24-24-24zM99.3 192.8C74.9 175.2 64 155.6 64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-15.1-5.2-29.2-12.4-41.7-21.4zM512 144c0 16.1-17.7 36.1-35.3 48.8-12.5 9-26.7 16.2-41.8 21.4 7-25 11.8-53.6 12.8-86.2H512v16z"></path></svg> ' +result.score.toString();
            var html_code = '<div class="ms-2 me-2 p-4"><div class="card" onclick=show_modal(' + result.id.toString() + ') id=' + result.id.toString() + ' solved="false"><div class="card-body"><h5 class="card-title">'+ result.nome +'</h5><p class="card-text">' + score_text + '</p></div></div></div>'
            $(".owl-carousel-"+category).append(html_code);
          }
        }  
    }
    xhttp.open("GET", "/getchall?category=" + category, false);
    xhttp.send();
           
}
 
// controlla se la flag inserita è giusta e in caso affermativo viene salvato nel database
function check_flag(id){
    if($("div[id="+id+"]").attr('solved') == "true"){
        document.getElementById('alert-already-success').style.display= "block";
        return;
    }
    var right_flag;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          right_flag = this.responseText;       }
    }
    xhttp.open("GET", "/getFlag?id="+ id, false);
    xhttp.send();
    var flag = document.getElementById('flag_response').value;
    if (flag == right_flag){
        document.getElementById('alert-success').style.display= "block";
        aggiungereUtenteChallenge(id);
        show_done_challenge();
    }
    else{
        document.getElementById('alert-danger').style.display= "block";
    }
    document.getElementById('flag_response').value = '';
}

// inserisce la challenge tra quelle risolte dall'utente

function aggiungereUtenteChallenge(id){
    var xhttp = new XMLHttpRequest();
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    date += " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {}};
    xhttp.open("POST", "/addUtenteChall?id="+ id + "&timestamp=" + date, false);
    xhttp.send();
}

// inserisce la hint dopo la conferma

function confirmHint(){
    var id = document.getElementById("btn_flag").getAttribute("idd");
    var xhttp = new XMLHttpRequest();
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    date += " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $(".hint-title").text("Hint");
          $(".hint-body").text(this.responseText);
          $(".btn-success-hint" ).attr("style", "display: none;"); 
          document.getElementById('hint_btn').style.backgroundColor = "#28a745";
          document.getElementById('hint_btn').style.borderColor = "#28a745";
        }
    }
    xhttp.open("GET", "/getHint?id="+ id + "&timestamp=" + date, false);
    xhttp.send();
    show_done_challenge();
}