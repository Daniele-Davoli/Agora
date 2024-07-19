class Timer {
    constructor () {
      this.isRunning = false;
      this.startTime = 0;
      this.overallTime = 0;
    }
  
    _getTimeElapsedSinceLastStart () {
      if (!this.startTime) {
        return 0;
      }
    
      return Date.now() - this.startTime;
    }
  
    start () {
      if (this.isRunning) {
        return 0;
      }
  
      this.isRunning = true;
  
      this.startTime = Date.now();
    }
  
    stop () {
      if (!this.isRunning) {
        return console.error('Timer is already stopped');
      }
  
      this.isRunning = false;
  
      this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }
  
    reset () {
      this.overallTime = 0;
  
      if (this.isRunning) {
        this.startTime = Date.now();
        return;
      }
  
      this.startTime = 0;
    }
  
    getTime () {
      if (!this.startTime) {
        return 0;
      }
  
      if (this.isRunning) {
        return this.overallTime + this._getTimeElapsedSinceLastStart();
      }
  
      return this.overallTime;
    }
}
const timer = new Timer();
var zoomFlag;

var ElencoEmail,k=0;
var Secondi;

var isSelected;
var TV;

var fontSize,icon,table;
var titolo,desc,flag2;
var info,PopUp;

var Numero="12345";
//const socket = new WebSocket('ws://' + window.location.host + "/ws")
var clockHandle;
let socket;

document.addEventListener("DOMContentLoaded", () => {
    socket = io();

    socket.on("profile", (name,surname) => {
        document.getElementById("Nome").innerHTML = name;
        document.getElementById("Cognome").innerHTML = surname;
    });

    /*if (window.profile) {
        document.getElementById("Nome").innerHTML = window.profile.name;
        document.getElementById("user-email").textContent = `Email: ${window.userInfo.email}`;
    }*/
});

window.onload = function(){

    




    new FontFace('CustomFont', 'url(/user/userContent/Font/dalekpinpointbold-webfont.woff) format("woff2")').load().then(function(loaded_face) {
        document.fonts.add(loaded_face)
    })
    Secondi=0;
    TV=true;
    isSelected=1;
    ElencoEmail=new Array();

    PopUp=document.getElementById("PopUp");
    info=document.getElementById("Info");
    table=document.getElementById("table_ground");
    icon=document.getElementById("IconReference");
    fontSize = document.querySelector(':root');
    window.addEventListener("resize", CoinResponsive);

    document.getElementById("add").value="";
    document.getElementById("TitoloRiunione").value="";
    document.getElementById("descrizione").value="";
    titolo=false;
    desc=false;
    flag2=false;

    zoomFlag=false;
    document.getElementById("TempoZoom").addEventListener('animationend',function (){
        document.getElementById("TempoZoom").style.width="95%"; 
        timer.stop();
        timer.reset();

    })
    document.getElementById("Tempo").addEventListener('animationend',function (){ 
        document.getElementById("Tempo").style.width="95%";
        timer.stop();
        timer.reset(); 
    })

    document.getElementById("BTNTV").addEventListener("click",Spegni_Accendi);
    document.getElementById("BTNTermina").addEventListener("click",Termina);
    document.getElementById("whitelist").addEventListener("click",WhiteList);
    document.getElementById("close").addEventListener("click",WhiteList);
    document.getElementById("Riunione").addEventListener("click",control);
    document.getElementById("TitoloRiunione").addEventListener("focus",function(){
        document.getElementById("TitoloRiunione").style.border="none";
        document.getElementById("TitoloRiunione").style.width="100%";
    });
    document.getElementById("descrizione").addEventListener("focus",function(){
        document.getElementById("descrizione").style.border="1px solid gray";
    });

    document.getElementById("add").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            inputWL();
        }


        var Text=add.value.toUpperCase();

        ElencoEmail.forEach(element => {
            k="";
            for(var i=0;i<Text.length;i++)k+=element.innerText.charAt(i).toUpperCase();

            if(k==Text) element.style.display="flex";
            else element.style.display="none";
        });
    });

    CoinResponsive();
    /*socket.onopen = function (e) {}

    socket.onmessage = function (e) {
        var event = JSON.parse(e.data)
        switch (event['command']) {
            case "otp.update":{
                Numero = event['otp']
                NumberUp(Numero, 1)
                break;
            }
            case "poll.update":{
                switch (event['answer']) {

                    case 0:{
                        document.getElementById('poll-no').innerHTML =  (Number(document.getElementById('poll-no').innerHTML) +1).toString()
                        break;
                    }

                    case 1:{
                        document.getElementById('poll-yes').innerHTML =  (Number(document.getElementById('poll-yes').innerHTML) +1).toString()
                        break;
                    }

                    case 2:{
                        document.getElementById('poll-boh').innerHTML =  (Number(document.getElementById('poll-boh').innerHTML) +1).toString()
                        break;
                    }
                
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    loadWhitelist()*/
}

function loadWhitelist(){
    document.querySelectorAll(".listMail").forEach(
        function(item){
            let mail = item.querySelector('.Mail').innerHTML
            ElencoEmail.push(item)

            item.querySelector('.XDiv').addEventListener('click', function(e){
                socket.send(`{ "command" : "whitelist.remove", "user" : "${mail}"}`)
                ElencoEmail.splice(ElencoEmail.indexOf(item), 1);
                item.remove();
            })
        }
    )
}

function CoinResponsive(){


    if(window.innerWidth<=500){
        document.getElementById("paper").style.scale="100%";
        document.getElementById("PopUpWL").style.scale="100%";
        //document.getElementById("PopUpSicuro").style.scale="100%";
        

        icon.style.width="auto";
        icon.style.height="99vh";
        info.style.width="auto";
        info.style.height="99vh";
        document.getElementById("paper").style.height="65vh";
        document.getElementById("paper").style.width="45vh";
        fontSize.style.setProperty('--fontSize', '2.6vh');

        document.getElementById("PopUpWL").style.height="40vh";
        document.getElementById("PopUpWL").style.width="30vh";

        table.style.height="127.6vh";
        table.style.width="193vh";

        fontSize.style.setProperty('--table', '2.6vh');

        //document.getElementById("PopUpSicuro").style.height="17vh";
        //document.getElementById("PopUpSicuro").style.width="40vh";
    }
    else{

        document.getElementById("paper").style.scale="80%";
        //document.getElementById("PopUpSicuro").style.scale="80%";

        if(icon.offsetHeight <= window.innerHeight){
            icon.style.width="auto";
            icon.style.height="100vh";
            info.style.width="177vh";
            info.style.height="100vh";
            PopUp.style.height="100vh";
            PopUp.style.width="53vh";

            document.getElementById("paper").style.height="110vh";
            document.getElementById("paper").style.width="77vh";
            fontSize.style.setProperty('--fontSize', '5vh');

            document.getElementById("PopUpWL").style.height="65vh";
            document.getElementById("PopUpWL").style.width="55vh";

            table.style.height="127.6vh";
            table.style.width="180vh";

            document.getElementById("Home").style.width="auto";
            document.getElementById("Home").style.height="100vh";
            fontSize.style.setProperty('--table', '5.22vh');
            fontSize.style.setProperty('--before', '5.91vh');
            fontSize.style.setProperty('--info', '4.8vh');
            fontSize.style.setProperty('--TVHeight', '4.9vh');

            

            //document.getElementById("PopUpSicuro").style.height="30vh";
            //document.getElementById("PopUpSicuro").style.width="65vh";
        }
        if(icon.offsetWidth <= window.innerWidth){
            icon.style.width="100vw";
            icon.style.height="auto";
            info.style.width="100vw";
            info.style.height="57vw";
            PopUp.style.height="100vh";
            PopUp.style.width="30vw";

            document.getElementById("paper").style.height="61.8vw";
            document.getElementById("paper").style.width="43.65vw";
            fontSize.style.setProperty('--fontSize', '2.7vw');

            document.getElementById("PopUpWL").style.height="35vw";
            document.getElementById("PopUpWL").style.width="30vw";

            table.style.height="66vw";
            table.style.width="100vw";

            document.getElementById("Home").style.height="auto";
            document.getElementById("Home").style.width="100vw";
            fontSize.style.setProperty('--table', '2.7vw');
            fontSize.style.setProperty('--before', '2.7vw');
            fontSize.style.setProperty('--info', '2.7vw');
            fontSize.style.setProperty('--TVHeight', '2.7vw');

            //document.getElementById("Invia").style.marginBottom="50%";

            //document.getElementById("PopUpSicuro").style.height="17vw";
            //document.getElementById("PopUpSicuro").style.width="37vw";
        }
    }
}




function WhiteList(){
    if(!flag2){
        document.getElementById("PopUpWL").style.display="flex";
    }
    else{
        document.getElementById("PopUpWL").style.display="none";
    }   
    flag2=!flag2;
}

function control(){
    if (document.getElementById("TitoloRiunione").getAttribute('placeholder') && document.getElementById("TitoloRiunione").value === '') {
        document.getElementById("TitoloRiunione").style.width="50%";
        document.getElementById("TitoloRiunione").style.border="2px solid red";
        titolo=false;
    }
    else{
        document.getElementById("TitoloRiunione").style.width="100%";
        document.getElementById("TitoloRiunione").style.border="none";
        titolo=true;
    }
    if (document.getElementById("descrizione").getAttribute('placeholder') && document.getElementById("descrizione").value === '') {
        document.getElementById("descrizione").style.border="2px solid red";
        desc=false;
    }
    else{
        document.getElementById("descrizione").style.border="1px solid gray";
        desc=true;
    }

    if(desc && titolo){

        //Creazione riunione
        socket.emit("CreaRiunione",document.getElementById("TitoloRiunione").value,document.getElementById("descrizione").value);

        //Creazione riunione





        AnimationDesc();
    }

}

function isAlreadyinWhitelist(user){
    trovato = false
    ElencoEmail.forEach(element => {
        if(element.innerText == user) trovato = true
    });
    return trovato
}

function inputWL(){
    var String=document.getElementById("add").value;
    if(String !=" " && !isAlreadyinWhitelist(String)){
        socket.send(`{ "command" : "whitelist.add", "user" : "${String}"}`)
        const div=document.createElement("li");
        const span=document.createElement("span");
        const XDiv=document.createElement("div")
        const XX=document.createElement("div")
        
        span.textContent = String;

        document.getElementById("list").appendChild(div);
        div.appendChild(span);
        div.appendChild(XDiv);
        XDiv.appendChild(XX);

        div.classList.add("listMail");
        span.classList.add("Mail");
        XDiv.classList.add("XDiv");
        XX.classList.add("X2");

        document.getElementById("add").value="";

        XDiv.addEventListener("click",function(){
            socket.send(`{ "command" : "whitelist.remove", "user" : "${String}"}`)
            ElencoEmail.splice(ElencoEmail.indexOf(div), 1);
            div.remove();
        })
        

        ElencoEmail.push(div);

    }
}

function AnimationDesc(){

    let title = document.getElementById('TitoloRiunione').value
    let description = document.getElementById('descrizione').value
    
    table.classList.add("AnimazioneCrea");
    document.getElementById("bodypaper").classList.add("AnimazioneCrea2");

    setTimeout(function(){
        document.getElementById("TV").addEventListener('click',TVClick);
        document.getElementById("Info").style.transitionDuration="1s";
        document.getElementById("Info").style.opacity="1.0";
        setTimeout(function(){
            document.getElementById("paper").style.display="none";
            document.getElementById("Info").style.transitionDuration="0s";
            document.getElementById("Info").style.pointerEvents="visible";
            document.getElementById("InfoClick").addEventListener('click',InfoClick);
            document.getElementById("Indietro").addEventListener('click',InfoIndietro);
            document.getElementById("close2").addEventListener('click',TVUnClick);

            document.getElementById("InviaDomanda").addEventListener('click',function(){
                let question = document.getElementById('descrizioneDomanda').value.replace(/[\n\r]+/g, ' ');
                socket.send(`{"command" : "poll.start", "question" : "${question}"}`)
                document.getElementById("descrizioneDomanda").value="";
                document.getElementById('poll-no').innerHTML = "0"
                document.getElementById('poll-yes').innerHTML = "0"
                document.getElementById('poll-boh').innerHTML = "0"
                document.getElementById("poll-started").style.visibility = "visible"
                document.getElementById("StopDomanda").style.visibility = "visible"
            })

            document.getElementById("StopDomanda").addEventListener('click', function(){
                socket.send(`{"command" : "poll.stop"}`)
                document.getElementById("StopDomanda").style.visibility = "hidden"
                document.getElementById("poll-started").style.visibility = "hidden"
            })

            document.getElementById("InfoClick").addEventListener('mouseover',function(){
                document.getElementById("Info").style.transitionDuration="0.2s"
                document.getElementById("Info").style.filter="grayscale(100%)";
                setTimeout(function(){
                    document.getElementById("Info").style.transitionDuration="0s"
                },500);
            });
            document.getElementById("InfoClick").addEventListener('mouseleave',function(){
                document.getElementById("Info").style.transitionDuration="0.2s"
                document.getElementById("Info").style.filter="grayscale(0%)";
                setTimeout(function(){
                    document.getElementById("Info").style.transitionDuration="0s"
                },500);
            });
        },1000);
    },1800);
}

function NumberUp(Number=" "){
    Numero=Number;
    timer.start();

    var Tempo=timer.getTime()/1000;
    var secondiRimanenti=14.9-Tempo;

    if(!zoomFlag){
        document.getElementById("Numero").innerHTML=Number;
        fontSize.style.setProperty('--animationDuration', secondiRimanenti+"s");
        document.getElementById("Tempo").classList.remove("ZoomAnimation");
        void document.getElementById("Tempo").offsetWidth;
        document.getElementById("Tempo").classList.add("ZoomAnimation");
    }
    else if(zoomFlag){
        document.getElementById("NumeroZoom").innerHTML=Number;
        fontSize.style.setProperty('--animationDuration', secondiRimanenti+"s");
        document.getElementById("TempoZoom").classList.remove("ZoomAnimation");
        void document.getElementById("TempoZoom").offsetWidth;
        document.getElementById("TempoZoom").classList.add("ZoomAnimation");
    }

}

function clock(){
    clockHandle = setTimeout(function(){
        if(Secondi++ == 14){
            Secondi = 0;
            return;
        }
        clock()
    },1000)
}

function InfoClick(){
    document.getElementById("Info").classList.remove("InfoIndietro");
    document.getElementById("Info").classList.add("InfoClick");
    setTimeout(function(){
        document.getElementById("PopUp").classList.remove("PopUpIndietro");
        document.getElementById("PopUp").classList.add("PopUp");
           
    },250)
}

function InfoIndietro(){
    document.getElementById("PopUp").classList.remove("PopUp");
    document.getElementById("PopUp").classList.add("PopUpIndietro");
    setTimeout(function(){
        document.getElementById("Info").classList.remove("InfoIndietro");
        document.getElementById("Info").classList.add("InfoIndietro");
    },250)
}

function TVClick(){
    //document.getElementById("Home").style.filter="blur(10px)";
    document.getElementById("zoom").style.display="flex";
    document.getElementById("Numero").style.display="none";
    var widthTempo=percentwidth(document.getElementById("Tempo"));
    document.getElementById("Tempo").classList.remove("ZoomAnimation");
    document.getElementById("Tempo").style.display="none";
    document.getElementById("TempoZoom").style.width=widthTempo;
    

    fontSize.style.setProperty('--TV', 'none');

    //if(zoomFlag!="stop"){
        zoomFlag=true;
        NumberUp(Numero);
    //}
}

function TVUnClick(){
    fontSize.style.setProperty('--TV', 'flex');
    //document.getElementById("Home").style.filter="none";
    document.getElementById("Numero").style.display="flex";
    document.getElementById("Tempo").style.display="flex";

    var widthTempo=percentwidth(document.getElementById("TempoZoom"));
    document.getElementById("Tempo").style.width=widthTempo;
    document.getElementById("TempoZoom").classList.remove("ZoomAnimation");
    document.getElementById("zoom").style.display="none";

        zoomFlag=false;
        NumberUp(Numero);
}


function Switch(x){
    var prima=isSelected;
    switch(x){
        case 0:{

            var children = document.getElementById('Richiamo').children;
            children.item(isSelected).classList.remove("Freccetta_Selezionata");

            if(isSelected==1)isSelected=3;
            else isSelected--;

            children.item(isSelected).classList.add("Freccetta_Selezionata");
            
        }break;
        case 1:{
            var children = document.getElementById('Richiamo').children;
            children.item(isSelected).classList.remove("Freccetta_Selezionata");
            isSelected=1;
            children.item(isSelected).classList.add("Freccetta_Selezionata");
        }break;
        case 2:{
            var children = document.getElementById('Richiamo').children;
            children.item(isSelected).classList.remove("Freccetta_Selezionata");
            isSelected=2;
            children.item(isSelected).classList.add("Freccetta_Selezionata");   
        }break;
        case 3:{
            var children = document.getElementById('Richiamo').children;
            children.item(isSelected).classList.remove("Freccetta_Selezionata");
            isSelected=3;
            children.item(isSelected).classList.add("Freccetta_Selezionata");
        }break;
        case 4:{
            var children = document.getElementById('Richiamo').children;
            children.item(isSelected).classList.remove("Freccetta_Selezionata");

            if(isSelected==3)isSelected=1;
            else isSelected++;

            children.item(isSelected).classList.add("Freccetta_Selezionata");
        }break;
    }
    var dopo=isSelected;
    SwitchCase(prima,dopo);

}

function SwitchCase(prima, dopo){
    const children = document.getElementById('Switch').children;

    prima--;
    dopo--;

    prima=children.item(prima);
    dopo=children.item(dopo);


    prima.style.transitionDuration="1s";
    prima.style.backgroundColor="rgba(255,255,255,0.1)"
    prima.style.scale="70%";
    dopo.style.backgroundColor="rgba(255,255,255,0.1)"

    setTimeout(function(){
        prima.style.transitionDuration="1s";
        prima.style.left="-100%";
        dopo.style.transitionDuration="1s";
        dopo.style.left="0%";

        setTimeout(function(){
            dopo.style.scale="100%";
            dopo.style.backgroundColor="rgba(255,255,255,0.0)"
            setTimeout(function(){
                dopo.style.transitionDuration="0s";
                prima.style.transitionDuration="0s";
                prima.style.left="100%";
            },250)
        },500);

    },300)
}

function Spegni_Accendi(){
    var televisione=document.getElementById("BTNTV");
    TV=!TV;
    if(TV){
        socket.send('{ "command" : "otp.start" }')
        document.getElementById("TV").addEventListener('click',TVClick);
        document.getElementById("TV").style.pointerEvents = "visible"
        televisione.style.boxShadow="0 0 10px red";
        document.getElementById("SpegniTV").innerText="Spegni la TV!";
        document.getElementById("SpegniTV2").innerText="Si toglierà la possibilità di entrare nella riunione (Si può riattivare in qualsiasi momento)";
    
        document.getElementById("TitoloCodice").style.display="flex";
        document.getElementById("Numero").style.display="flex";
        document.getElementById("Tempo").style.display="flex";
        fontSize.style.setProperty('--TV', 'flex');
    }
    else{
        window.clearTimeout(clockHandle)
        document.getElementById("TV").removeEventListener('click',TVClick);
        timer.stop()
        timer.reset()
        document.getElementById("TV").style.pointerEvents = "none"
        socket.send('{ "command" : "otp.stop" }')
        televisione.style.boxShadow="0 0 10px green";
        document.getElementById("SpegniTV").innerText="Accendi la TV!";
        document.getElementById("SpegniTV2").innerText="Permetterai di far unire le persone alla tua riunione";
    
        document.getElementById("TitoloCodice").style.display="none";
        document.getElementById("Numero").style.display="none";
        document.getElementById("Tempo").style.display="none";
        fontSize.style.setProperty('--TV', 'none');
    }
    
}


function Termina(){
    socket.emit("TerminaRiunione");
    socket.close();
    window.location.pathname="/admin";
}




function percentwidth(elem){
    var pa= elem.offsetParent || elem;
    return ((elem.offsetWidth/pa.offsetWidth)*100).toFixed(2)+'%';
}

