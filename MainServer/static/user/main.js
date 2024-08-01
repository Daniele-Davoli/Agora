var coin, icon, timer, Transform, fontSize, reload=false;

window.onload = function(){ 
    new FontFace('CustomFont', 'url(/user/userContent/Font/dalekpinpointbold-webfont.woff) format("woff2")').load().then(function(loaded_face) {
        document.fonts.add(loaded_face)
    })

    coin=document.getElementById("Coin");
    icon=document.getElementById("IconCoin");
    timer=document.getElementById("Loading");

    coin.addEventListener("timeupdate", Icon,false);
    coin.addEventListener("ended", CoinEnd);
}


function CoinEnd(){

    coin.removeEventListener("ended", CoinEnd);
    coin.style.display= "none";

    
    icon.style.transitionDuration="1s";
    icon.style.backgroundSize="100vh";
    icon.style.transform="translateY(-15%)";
    timer.style.transitionDelay="0.5s";
    timer.style.transitionDuration="1s";
    timer.style.opacity="1.0";

    setTimeout(Caricamento,1500);
}

function Icon(){
    if(this.currentTime > this.duration-0.5){
        icon.style.opacity="1.0";
        coin.removeEventListener("timeupdate", Icon,false);
    }
}

function Caricamento(){
    timer.style.transitionDuration="0s";
    timer.style.transitionDelay="0s";
    icon.style.transitionDuration="0s";
    setTimeout(EndLoading,2000)
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


        
