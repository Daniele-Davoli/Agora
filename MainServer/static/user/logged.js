document.addEventListener("DOMContentLoaded", () => {
    socket = io();
    

    socket.on("errPassword",() => {
        document.getElementById("codice").value="";
    })

    socket.on("redirect",() => {
        Agree();
    })

    socket.on("logout",() => {
        socket.close();
        window.location.pathname="/";
    })

    socket.on("ListaRiunioni",(riunioni)=> {
        const riunioniSelezione = document.getElementById("riunioni");

        riunioni.forEach(riunione => {
            const option = document.createElement("option");
            option.value = riunione.IDRoom;
            option.textContent = riunione.Titolo;
            riunioniSelezione.appendChild(option);
        });
    })
});

window.onload = function(){
    socket.emit("ListaRiunioni");


    document.getElementById('codice').value="";
    document.getElementById('codice').addEventListener('input', function (e) {
        let value = e.target.value;
    
        // Rimuovi qualsiasi carattere non numerico
        value = value.replace(/\D/g, '');
        e.target.value = value;

        if(value.length == 5){
            var IDRoom=document.getElementById("riunioni").value;
            console.log(value);
            socket.emit("Password",value,IDRoom);
            //Agree();
        }
    });

    let sfocatura=document.getElementById("Sfocatura");

    setTimeout(function(){
        sfocatura.style.transitionDuration="2s";
        sfocatura.style.opacity="0.0";

        BackMovIn();

        setTimeout(function(){
            sfocatura.style.transitionDuration="0s";
            sfocatura.style.display="none";
        },2000);
    },1000)
}

function BackMovIn(){
    let table = document.getElementById("table_ground");
    let container = document.getElementById("ContainerBanco");

    table.style.transitionDuration="2s";
    table.style.transitionTimingFunction="ease-in-out"
    table.style.transform="translateX(-8.2%) rotateX(0deg) rotateZ(90deg)";
    table.style.height="100%";

    container.style.transitionDuration="2s";
    container.style.transform="translateZ(11.6vh)";

    

    setTimeout(()=>{
        table.style.transitionDuration="0s";
        container.style.transitionDuration="0s";

        document.getElementById("foglio").style.transitionDuration="1s";
        document.getElementById("foglio").style.opacity="1";

        setTimeout(function(){
            document.getElementById("foglio").style.transitionDuration="0s";
        
            Help();
        
        },1000)
    },2000)
}

function Help(){
    let riunioni= document.getElementById("riunioni");
    let codice= document.getElementById("codice");

    riunioni.addEventListener("click",function(){
        riunioni.style.animation="none";

        setTimeout(function(){
            codice.style.animation="Lampeggio 1s infinite forwards";
        },1000)
    })

    codice.addEventListener("click",function(){
        codice.style.animation="none";
    })
}

//************************************************************************
//*Codice inserito correttamente e la pagina viene reindirizzata altrove *
//************************************************************************

function Agree(){
    let table = document.getElementById("table_ground");

    table.style.transitionDuration="1s";
    table.style.transitionTimingFunction="ease-out";
    table.style.scale="120%";

    setTimeout(()=>{
        window.location = "/user/joined";
    },1000)
}