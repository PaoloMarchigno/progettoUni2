function validazione() {
    if(controllaCAP()) {
        if(document.getElementById("rmb").checked) {
            alert("Hai scelto di essere ricordato per i prossimi accessi");
        }
        else alert("Hai scelto di non ricordarti per i prossimi accessi");
    }
    else {
        alert("Invalid CAP!");
        return false;
    }
    return false;
}

function controllaCAP() {
    const cap = document.Myform.cap.value;
    return cap.length==5 && !isNaN(cap);
}