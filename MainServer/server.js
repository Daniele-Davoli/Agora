const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mysql = require('mysql'); 

require('./passport-setup');

const app = express();
const port = 8080;

// Servire i file statici dalla cartella 'public'
app.use(express.static('public'));

app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Route principale
app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});



//Autentificazione
app.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
  // Autenticazione riuscita
  res.redirect('/profile');
});






// Rotta per visualizzare il profilo utente
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  
  let profile=req.user;
  //Check account nel DB 
  {
    

    var con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "agorà"
      });
      
    con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT COUNT(*) as num FROM users WHERE oauth_provider = '"+profile.provider+"' AND first_name = '"+profile.name.givenName+"' AND email = '"+profile.emails[0].value+"'",(err,result)=>{
            if (err) throw err;

            if(result[0].num == 1 ){
                let query = `
                  UPDATE users 
                  SET 
                    modified = NOW(),
                    picture = '${profile.photos[0].value}',
                    email = '${profile.emails[0].value}',
                    first_name = '${profile.name.givenName}',
                    oauth_uid = '${profile.id}',
                    oauth_provider = '${profile.provider}'
                  WHERE 
                    oauth_provider = '${profile.provider}' AND 
                    first_name = '${profile.name.givenName}' AND 
                    email = '${profile.emails[0].value}'
                `;
                
                con.query(query,(err,result)=>{
                    if (err) throw err;
                    console.log("Utente aggiornato");
                });
            }
            else if(result[0].num == 0 ){
                let query= "INSERT INTO users (modified, created, picture, email, first_name, oauth_uid, oauth_provider) VALUES (NOW(), NOW(), '"+profile.photos[0].value+"', '"+profile.emails[0].value+"', '"+profile.name.givenName+"', '"+profile.id+"', '"+profile.provider+"');"
                
                con.query(query,(err,result)=>{
                    if (err) throw err;
                    console.log("Nuovo utente creato",);
                });
            }
            else{
              throw "Errore, piu account esistenti";
            }
        });
    });
  }


  res.sendFile(__dirname + '/private/main.html');
});







// Avviare il server
app.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});
