flag=false;
let intervall;

window.onload=()=>{
}



function si(){
    clearInterval(intervall);
    document.body.style.backgroundColor="rgb(33,33,33)";
    setTimeout(()=>{
        alert("ti amo anche io");
    },100)

}

function no(){
    intervall=setInterval(()=>{
        if(flag)document.body.style.backgroundColor="red";
        else document.body.style.backgroundColor="blue";

        flag=!flag;
    },100);
}