var coin, icon, timer, Transform, fontSize;

window.onload = function(){
    
    

    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
    
    new FontFace('CustomFont', 'url(/publicContent/Font/dalekpinpointbold-webfont.woff) format("woff2")').load().then(function(loaded_face) {
        document.fonts.add(loaded_face)
    })
    coin=document.getElementById("Coin");
    icon=document.getElementById("IconCoin");
    timer=document.getElementById("Loading");
    fontSize = document.querySelector(':root');

    Transform="";

    CoinResponsive();

    coin.addEventListener("timeupdate", Icon,false);
    coin.addEventListener("ended", CoinEnd);
    window.addEventListener("resize", CoinResponsive);
    
    
    
    /*let wsStart = 'ws://'
    let endpoint = wsStart + window.location.host + "/loading"
    let socket = new WebSocket(endpoint)
    socket.onopen = function(e){}
    socket.onmessage = function (e) {
        EndLoading()
        socket.close()
    }*/

}


function CoinResponsive(Tr=""){
    if(Tr=="none")Transform="";
    if(Tr!="[object Event]")Transform+=Tr;

    

    if(window.innerWidth<=500){
        var temp=Transform;
        if(Transform!="")temp+="h)";

        coin.style.width="auto";
        coin.style.height="100vh";
        icon.style.width="auto";
        icon.style.height="100vh";
        icon.style.transform=temp;
        coin.style.transform=temp;

        fontSize.style.setProperty('--fontSize', '3vh');
    }
    else{
        if(icon.offsetHeight <= window.innerHeight){
            var temp=Transform;
            if(Transform!="")temp+="w)";
            
            coin.style.width="auto";
            coin.style.height="100vh";
            icon.style.width="auto";
            icon.style.height="100vh";

            icon.style.transform=temp;
            coin.style.transform=temp;

            fontSize.style.setProperty('--fontSize', '5vh');
        }
        if(icon.offsetWidth <= window.innerWidth){
            coin.style.width="99%";
            coin.style.height="auto";
            icon.style.width="99%";
            icon.style.height="auto";

            fontSize.style.setProperty('--fontSize', '2.7vw');

            if(Transform!=""){
                var temp=Transform+="h)";
                icon.style.transform=temp;
                coin.style.transform=temp;
            }
        }
    }

    document.getElementById("Coin").play();

}

function CoinEnd(){

    coin.removeEventListener("ended", CoinEnd);
    coin.style.display= "none";

    
    icon.style.transitionDuration="1s";
    timer.style.transitionDelay="0.5s";
    timer.style.transitionDuration="1s";
    timer.style.opacity="1.0";
    icon.style.scale="60%";
    
    CoinResponsive(" translateY(-20v");
    setTimeout(Caricamento,1100);
}

function Icon(){


    if(this.currentTime > this.duration-1){
        icon.style.opacity="1.0";
        coin.removeEventListener("timeupdate", Icon,false);

    }

}

function Caricamento(){
    timer.style.transitionDuration="0s";
    timer.style.transitionDelay="0s";
    icon.style.transitionDuration="0s";
    setTimeout(EndLoading,5000)
}

//********************************************************
//* Chiamare EndLoading(); per far finire il caricamento *
//******************************************************** 

function EndLoading(){
    var sfocatura,table,google_button;

    sfocatura=document.getElementById("Sfocatura");
    table=document.getElementById("Home");
    google_button=document.getElementById("Google_button");

    sfocatura.style.display="flex";
    google_button.style.display="flex";

    setTimeout(function(){
        sfocatura.style.transitionDuration="2s";
        table.style.transitionDuration="2s";
        google_button.style.transitionDuration="2s";
        icon.style.transitionDuration="2s";
        timer.style.transitionDuration="2s";

        sfocatura.style.opacity="1.0";
        table.style.opacity="1.0";
        google_button.style.opacity="1.0";
        icon.style.opacity="0.0";
        timer.style.opacity="0.0";

        setTimeout(function(){
            sfocatura.style.transitionDuration="0s";
            table.style.transitionDuration="0s";
            google_button.style.transitionDuration="0s";
            icon.style.transitionDuration="0s";
            timer.style.transitionDuration="0s";
            icon.style.zIndex="-1";
        },2000);
    },250)
}


        
