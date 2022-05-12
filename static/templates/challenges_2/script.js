var card_list = document.getElementsByClassName('card');
for(i=0;i<card_list.length;i++) {
    card_list[i].setAttribute('data-bs-toggle','modal');
    card_list[i].setAttribute('data-bs-target','#myModal');
}