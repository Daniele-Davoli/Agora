var coin, icon,icon2, timer, Transform, fontSize, CoinClick, Str,Color3, Color2, flag=true,Percentuage,flagEffect=true;

window.onload = function(){
    new FontFace('CustomFont', 'url(/user/userContent/Font/dalekpinpointbold-webfont.woff) format("woff2")').load().then(function(loaded_face) {
        document.fonts.add(loaded_face)
    })
    coin=document.getElementById("Coin");
    icon=document.getElementById("IconCoin");
    icon2=document.getElementById("IconCoin2");
    timer=document.getElementById("Loading");
    fontSize=document.querySelector(':root');
    CoinClick=document.getElementById("CoinClick");

    Transform="";

    coin.addEventListener("timeupdate", Icon,false);
    coin.addEventListener("ended", CoinEnd);
    window.addEventListener("resize", CoinResponsive);
    
    Percentuage=50;
    Color3="rgb(50, 50, 50) ";
    Color2="rgb(100, 100, 100) ";

    CoinResponsive();
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

        icon2.style.width="auto";
        icon2.style.height="100vh";
        CoinClick.style.width="auto";
        CoinClick.style.height="100vh";

        fontSize.style.setProperty('--fontSize', '3vh');
        fontSize.style.setProperty('--googleBTN', '3vh');
    }
    else{
        if(icon.offsetHeight <= window.innerHeight){
            if(Transform!=""){
                var temp=Transform+"w)";
                icon.style.transform=temp;
                coin.style.transform=temp;
            }
            
            coin.style.width="auto";
            coin.style.height="99vh";
            icon.style.width="auto";
            icon.style.height="99vh";
            icon2.style.width="auto";
            icon2.style.height="99vh";
            CoinClick.style.width="auto";
            CoinClick.style.height="99vh";

            fontSize.style.setProperty('--fontSize', '5vh');
            fontSize.style.setProperty('--googleBTN', '4.85vh');
        }
        if(icon.offsetWidth <= window.innerWidth){
            coin.style.width="99vw";
            coin.style.height="auto";
            icon.style.width="99vw";
            icon.style.height="auto";
            icon2.style.width="99vw";
            icon2.style.height="auto";
            CoinClick.style.width="99vw";
            CoinClick.style.height="auto";

            fontSize.style.setProperty('--fontSize', '2.7vw');
            fontSize.style.setProperty('--googleBTN', '2.7vw');

            if(Transform!=""){
                var temp=Transform+="h)";
                icon.style.transform=temp;
                coin.style.transform=temp;
            }
        }
    }
}

function CoinEnd(){

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
    }
}

function Caricamento(){
    timer.style.transitionDuration="0s";
    timer.style.transitionDelay="0s";
    icon.style.transitionDuration="0s";

    setTimeout(EndLoading,1000);
}


function EndLoading(){
    document.getElementById("Loading").style.transitionDuration="2s";
    document.getElementById("Loading").style.opacity="0.0";

    icon.style.transitionDuration="2s";
    icon.style.transitionDelay="1.3s";
    icon.style.transform="none";

    icon2.style.transitionDuration="1s";

    CoinResponsive("none");

    setTimeout(function(){
        icon2.style.opacity="1.0";
        icon2.style.backgroundColor="rgba(255,255,255,0.1)"
        icon.style.opacity="0.0";

        CoinClick.style.transitionDuration="2s";
        CoinClick.style.opacity="1.0";
        CoinClick.style.filter="blur(6px)";

        setTimeout(function(){
            icon.style.transitionDuration="0s";
            icon.style.transitionDelay="0s";
            icon2.style.transitionDuration="0s";
            setTimeout(function(){
                CoinClick.style.transitionDuration="0s";
                EndLoading2();
            },1000)
        },1000);
    },3000)

}

function EndLoading2(){
    document.getElementById("IconClickEffect").style.cursor="pointer";
    document.getElementById("IconClickEffect").addEventListener('click',CoinClickEvent);
    document.getElementById("IconClickEffect").addEventListener('mouseover',IconHover);
    document.getElementById("IconClickEffect").addEventListener('mouseleave',IconLeave);
    document.getElementById("Effect").style.transitionDuration="1s";
    document.getElementById("Effect").style.opacity="1.0";
    document.getElementById("Press").style.display="flex";
    
    window.addEventListener('keypress',CoinClickEvent);

    Effect();
}
function IconHover(){
    icon2.style.transitionDuration="0.3s";
    icon2.style.filter="grayscale(60%)";
    setTimeout(function(){icon2.style.transitionDuration="0s";},300);
}

function IconLeave(){
    icon2.style.transitionDuration="0.3s";
    icon2.style.filter="grayscale(0%)";
    setTimeout(function(){icon2.style.transitionDuration="0s";},300);
}

function Effect(){
    if(flagEffect){
        Str="radial-gradient("+Color2+Percentuage+"%,"+Color3+"70%)"
        document.getElementById("Circle").style.background=Str;

        Percentuage--;

        if(Percentuage!=0)setTimeout(Effect,25);
        else if(flag){
            /*var temp=Color2;
            Color2=Color3;
            Color3=temp;*/
            Percentuage=50;
            Effect();
        }
    }
}

function CoinClickEvent(){  
    window.removeEventListener('keypress',CoinClickEvent);
    document.getElementById("Press").style.display="none";

    document.getElementById("Effect").style.transitionDuration="1s";
    document.getElementById("Effect").style.opacity="0.0";
    icon2.style.transitionDuration="1s";
    icon2.style.backgroundColor="rgba(255,255,255,0.0)";
    icon2.style.opacity="0.0";
    CoinClick.style.transitionDuration="1s";
    CoinClick.style.filter="none";
    setTimeout(function(){
        icon2.style.transitionDuration="0s";
        CoinClick.style.transitionDuration="0s";
        flagEffect=false;
        document.getElementById("Effect").style.transitionDuration="0s";
        document.getElementById("Effect").style.display="none";
        document.getElementById("IconClickEffect").style.display="none";
        setTimeout(function(){
            CoinClick.addEventListener("timeupdate", IconCoinClick,false);
            CoinClick.play();
        },500)
    },1000)
}

function IconCoinClick(){
    if(this.currentTime > this.duration-0.5){
        CoinClick.pause();
        document.getElementById("Google_button").style.display="flex";
        setTimeout(function(){
            document.getElementById("Google_button").style.transitionDuration="1s";
            document.getElementById("Google_button").style.opacity="1.0";
            setTimeout(function(){
                document.getElementById("Google_button").style.transitionDuration="0s";
            },1000)
        },250)
    }
}