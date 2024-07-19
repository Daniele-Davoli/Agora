const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const mysql = require('mysql'); 
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);


const port=80;


app.use('/user', express.static(__dirname + '/static/user'));
app.use('/admin', express.static(__dirname + '/static/admin'));

app.use(session({
  secret: 'Agora2024',
  resave: false,
  saveUninitialized: true
}));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use(async (req, res, next) => {
  if((/^\/(user|admin)\/auth\/google$/).test(req.originalUrl)){
    let fullUrl = `${req.originalUrl}/callback`;

    console.log(fullUrl);

    passport.use(new GoogleStrategy({
      clientID: '382797113950-puuvr948htop43ii77t4bn99966smdf6.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: `${fullUrl}`
    },function(token, tokenSecret, profile, done) {
      //profile check
          
      return done(null, profile);
    }));
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());





















app.get('/',async (req, res) => {
  res.sendFile(__dirname + '/private/user/main.html');
});

//Autentificazione USER
app.get('/user/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/user/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
  // Autenticazione riuscita
  res.redirect('/userProfile');
});

// Rotta per visualizzare il profilo utente
app.get('/userProfile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  let profile=req.user;

  res.send("Authenticated as User");
});
























app.get('/admin',async (req, res) => {
  res.sendFile(__dirname + '/private/admin/main.html');
});

//Autentificazione ADMIN
app.get('/admin/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/admin/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
  // Autenticazione riuscita
  res.redirect('/adminProfile');
});

// Rotta per visualizzare il profilo admin
app.get('/adminProfile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin');
  }
  
  let profile=req.user;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "agorà"
  });


  con.connect(function(err) {
    if (err) throw err;


    con.query("SELECT COUNT(*) as num FROM admin WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'",(err,result)=>{
      if (err) throw err;

      if(result[0].num != 0 ){
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

          console.log("Admin aggiornato");
        });
      }
      else{
        let query= `
          INSERT INTO admin (modified, created, picture, email, first_name, oauth_uid, oauth_provider) 
          VALUES (NOW(), NOW(), '"+profile.photos[0].value+"', '"+profile.emails[0].value+"', '"+profile.name.givenName+"', '"+profile.id+"', '"+profile.provider+"');
          `;
              
        con.query(query,(err,result)=>{
          if (err) throw err;

          console.log("Nuovo admin creato",);
        });
        
        
        /*con.query("SELECT COUNT(*) as num FROM users WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'",(err,result)=>{
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
            if(profile.emails[0].value.toLowerCase().trim() == "danidavo05@gmail.com"){
              let query= "INSERT INTO admin (modified, created, picture, email, first_name, oauth_uid, oauth_provider) VALUES (NOW(), NOW(), '"+profile.photos[0].value+"', '"+profile.emails[0].value+"', '"+profile.name.givenName+"', '"+profile.id+"', '"+profile.provider+"');"
              
              con.query(query,(err,result)=>{
                  if (err) throw err;
                  console.log("Nuovo admin creato",);
              });
            }
            else{
              let query= "INSERT INTO users (modified, created, picture, email, first_name, oauth_uid, oauth_provider) VALUES (NOW(), NOW(), '"+profile.photos[0].value+"', '"+profile.emails[0].value+"', '"+profile.name.givenName+"', '"+profile.id+"', '"+profile.provider+"');"
              
              con.query(query,(err,result)=>{
                  if (err) throw err;
                  console.log("Nuovo utente creato",);
              });
            }
          }
          else{
            throw "Errore, piu account esistenti";
          }


          res.sendFile(__dirname + '/user/main.html');
        });*/
      }

      
    });
  });

  res.sendFile(__dirname + '/admin/admin.html');


  //Check account nel DB 
  /*{
    

    var con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "agorà"
      });
      
    con.connect(function(err) {
        if (err) throw err;


        con.query("SELECT COUNT(*) as num FROM admin WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'",(err,result)=>{
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
                  console.log("Admin aggiornato");

                  res.sendFile(__dirname + '/admin/main.html');
              });
          }
          else{
            con.query("SELECT COUNT(*) as num FROM users WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'",(err,result)=>{
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
                if(profile.emails[0].value.toLowerCase().trim() == "danidavo05@gmail.com"){
                  let query= "INSERT INTO admin (modified, created, picture, email, first_name, oauth_uid, oauth_provider) VALUES (NOW(), NOW(), '"+profile.photos[0].value+"', '"+profile.emails[0].value+"', '"+profile.name.givenName+"', '"+profile.id+"', '"+profile.provider+"');"
                  
                  con.query(query,(err,result)=>{
                      if (err) throw err;
                      console.log("Nuovo admin creato",);
                  });
                }
                else{
                  let query= "INSERT INTO users (modified, created, picture, email, first_name, oauth_uid, oauth_provider) VALUES (NOW(), NOW(), '"+profile.photos[0].value+"', '"+profile.emails[0].value+"', '"+profile.name.givenName+"', '"+profile.id+"', '"+profile.provider+"');"
                  
                  con.query(query,(err,result)=>{
                      if (err) throw err;
                      console.log("Nuovo utente creato",);
                  });
                }
              }
              else{
                throw "Errore, piu account esistenti";
              }


              res.sendFile(__dirname + '/user/main.html');
            });
          }
        });
    });
  }*/
});























//Socket
io.on('connection', async (socket) => {
  console.log('user connected');



  socket.on('message', (msg) => {
    console.log('received message:', msg);
    io.emit('message', msg);
  });



  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});








server.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});