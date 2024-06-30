window.onload=()=>{

}

// Credential response handler function
function handleCredentialResponse(response){

    response=response['credential'].split(".");
    let responsePayload=JSON.parse(atob(response[1]));

    let profileHTML = '<h3>Welcome '+responsePayload.given_name+'! <a href="javascript:void(0);" onclick="signOut('+responsePayload.sub+');">Sign out</a></h3>';
    profileHTML += '<img src="'+responsePayload.picture+'"/><p><b>Auth ID: </b>'+responsePayload.sub+'</p><p><b>Name: </b>'+responsePayload.name+'</p><p><b>Email: </b>'+responsePayload.email+'</p>';
    document.getElementsByClassName("pro-data")[0].innerHTML = profileHTML;
            
    document.querySelector("#btnWrap").classList.add("hidden");
    document.querySelector(".pro-data").classList.remove("hidden");
}

// Sign out the user
function signOut(authID) {
    document.getElementsByClassName("pro-data")[0].innerHTML = '';
    document.querySelector("#btnWrap").classList.remove("hidden");
    document.querySelector(".pro-data").classList.add("hidden");
}    