window.onload=() => {
    const socket = io();

    let input = document.getElementById("testo");
    let form = document.getElementById("FormDiProva");

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('message', input.value);
            input.value = '';
        }
    });

    socket.on('message', (msg) => {
        input.value ='received message:' + msg;
    });
}