const express = require('express');
const app = express();
const port = 80;

// Servire i file statici dalla cartella 'public'
app.use(express.static('public'));

// Route principale
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});

// Avviare il server
app.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});
