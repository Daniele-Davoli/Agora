var fontSize, icon, risposta;
let socket, IDDomanda;

//" risposta " è la variabile con la risposta al Kahoot
//PopUp(Text); funzione per fare il kahoot [MASSIMO 150 CARATTERI]


document.addEventListener("DOMContentLoaded", () => {
    socket = io();

    socket.on("InfoRiunione",(titolo,nome,cognome,descrizione) => {
        document.getElementById("TitoloRiunione").innerHTML = titolo;
        document.getElementById("Nome").innerHTML = nome;
        document.getElementById("Cognome").innerHTML = cognome;
        document.getElementById("descrizione").innerHTML = descrizione;
    })

    socket.on("Domanda",(msg,id)=>{
        IDDomanda=id;
        PopUp(msg);
    })

    socket.on("StopDomanda",()=>{
        document.getElementById("backPopUp").style.display="none";
        socket.emit("Risposta", "mi astengo",IDDomanda)
    });
});

window.onload = (event) => {
    

    setTimeout(function(){
        document.getElementById("loading-container").style.animation="fadeout 1s linear";
        setTimeout(function(){
            document.getElementById("loading-container").style.display="none";
        }, 1000);
    }, 2000);
	
    document.getElementById("Riunione").addEventListener('click', Submit);

    document.getElementById("siSicuro").addEventListener('click', function () {
        socket.emit("logout");
        window.location.pathname="/";
    });
    document.getElementById("noSicuro").addEventListener('click', function () {
        document.getElementById("Sicuro").style.display = "none";
    });

    document.getElementById("si").addEventListener('click', function () {
        Risposta(1);
    });
    document.getElementById("no").addEventListener('click', function () {
        Risposta(0);
    });
    document.getElementById("mi_astengo").addEventListener('click', function () {
        Risposta(2);
    });

    icon = document.getElementById("IconReference");
    fontSize = document.querySelector(':root');
    window.addEventListener("resize", CoinResponsive);

    CoinResponsive();
}

function Risposta(value){
    switch(value){
        case 0:{
            socket.emit("Risposta", "no",IDDomanda);
        }break;
        case 1:{
            socket.emit("Risposta", "si",IDDomanda);
        }break;
        case 2:{
            socket.emit("Risposta", "mi astengo",IDDomanda);
        }break;
    }

    document.getElementById("backPopUp").style.display="none";
}

function CoinResponsive() {


    if (window.innerWidth <= 500) {
        document.getElementById("paper").style.scale = "100%";
        document.getElementById("PopUp").style.scale = "100%";
        document.getElementById("PopUpSicuro").style.scale = "100%";

        icon.style.width = "auto";
        icon.style.height = "99vh";
        document.getElementById("paper").style.height = "65vh";
        document.getElementById("paper").style.width = "45vh";
        fontSize.style.setProperty('--fontSize', '2.6vh');

        document.getElementById("PopUp").style.height = "40vh";
        document.getElementById("PopUp").style.width = "30vh";
        document.getElementById("PopUpSicuro").style.height = "17vh";
        document.getElementById("PopUpSicuro").style.width = "40vh";
    }
    else {

        document.getElementById("paper").style.scale = "80%";
        document.getElementById("PopUp").style.scale = "80%";
        document.getElementById("PopUpSicuro").style.scale = "80%";

        if (icon.offsetHeight <= window.innerHeight) {
            icon.style.width = "auto";
            icon.style.height = "100vh";
            document.getElementById("paper").style.height = "110vh";
            document.getElementById("paper").style.width = "77vh";
            fontSize.style.setProperty('--fontSize', '5vh');

            document.getElementById("PopUp").style.height = "70vh";
            document.getElementById("PopUp").style.width = "55vh";
            document.getElementById("PopUpSicuro").style.height = "30vh";
            document.getElementById("PopUpSicuro").style.width = "65vh";
        }
        if (icon.offsetWidth <= window.innerWidth) {
            icon.style.width = "100vw";
            icon.style.height = "auto";

            document.getElementById("paper").style.height = "61.8vw";
            document.getElementById("paper").style.width = "43.65vw";
            fontSize.style.setProperty('--fontSize', '2.7vw');

            document.getElementById("PopUp").style.height = "35vw";
            document.getElementById("PopUp").style.width = "30vw";
            document.getElementById("PopUpSicuro").style.height = "17vw";
            document.getElementById("PopUpSicuro").style.width = "37vw";
        }
    }
}




function PopUp(question = "") {
    risposta = "";
    document.getElementById("TextDomanda").innerHTML = question;
    document.getElementById("backPopUp").style.display = "flex";

}



function Submit() {
    document.getElementById("Sicuro").style.display = "flex"; 
}
