var sfocatura,google_button,fontSize,flag, k;

//Inserire il POST con il Codice
var String="22222";
//Inserire il POST con il Codice

document.addEventListener("DOMContentLoaded", () => {
    socket = io();

    socket.on("errPassword",() => {
        document.getElementById("codice").value="";
        document.getElementById("IDRoom").value="";
    })

    socket.on("redirect",() => {
        window.location.pathname="/user/joined";
    })

    socket.on("logout",() => {
        socket.close();
        window.location.pathname="/";
    })
});

window.onload = function(){
    document.getElementById("codice").value = "";
    k=0;
    flag=false;
    sfocatura=document.getElementById("Sfocatura");
    google_button=document.getElementById("Google_button");
    fontSize = document.querySelector(':root');

    CoinResponsive();

    setTimeout(function(){
        sfocatura.style.transitionDuration="2s";
        google_button.style.transitionDuration="2s";

        sfocatura.style.opacity="0.0";
        google_button.style.opacity="0.0";

        setTimeout(function(){
            sfocatura.style.transitionDuration="0s";
            google_button.style.transitionDuration="0s";
            google_button.style.display="none";
            document.getElementById("Home").style.zIndex="2";
            BackMovIn();
        },2000);
    },1000)
}

function BackMovIn(){
    flag=true;
    document.getElementById("table_ground").className="groundin";

    setTimeout(function(){document.getElementById("codice").addEventListener('keyup', (e) => {
            
        x=document.getElementById("codice");

        if(isNaN(x.value)){
            var y="";
            for(var i=0;i<x.value.length-1;i++){
                y+=x.value[i];
            }
                document.getElementById("codice").value = y;
        }
        
        if(x.value.length==5){
            var x=document.getElementById("codice").value;
            var IDRoom=document.getElementById("IDRoom").value;
            socket.emit("Password",x,IDRoom);
        }
      })
    }, 1000);
}

function CoinResponsive(){
    if(window.innerWidth<=500){
        fontSize.style.setProperty('--zoom', '800%');
        fontSize.style.setProperty('--table-width', '-4vw');
        fontSize.style.setProperty('--table-height', '-11.8vw');
    }
    else if(window.innerWidth<=1000){
        fontSize.style.setProperty('--zoom', '300%');
        fontSize.style.setProperty('--table-width', '-8.5vw');
        fontSize.style.setProperty('--table-height', '-9vw');
    }
    else{
        fontSize.style.setProperty('--zoom', '200%');
        fontSize.style.setProperty('--table-width', '-13vw');
        fontSize.style.setProperty('--table-height', '-8vw');
    }
}



//************************************************************************
//*Codice inserito correttamente e la pagina viene reindirizzata altrove *
//************************************************************************

function Agree(){
}