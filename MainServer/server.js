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

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agorà"
});
con.connect(function(err) {
  if (err) throw err;
});


app.use('/user', express.static(__dirname + '/static/user'));
app.use('/admin', express.static(__dirname + '/static/admin'));


const sessionMiddleware = session({
  secret: "Agora2024",
  resave: true,
  saveUninitialized: true,
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);


passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use(async (req, res, next) => {
  if((/^\/(user|admin)\/auth\/google$/).test(req.originalUrl)){
    let fullUrl = `${req.originalUrl}/callback`;

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
app.get('/adminProfile', async(req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin');
  }
  
  let profile=req.user;
  
  
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
      });
    }
    else{
      let query= `
        INSERT INTO admin (modified, created, picture, email, first_name, oauth_uid, oauth_provider) 
        VALUES (NOW(), NOW(), '${profile.photos[0].value}', '${profile.emails[0].value}', '${profile.name.givenName}', '${profile.id}', '${profile.provider}');
        `;
              
      con.query(query,(err,result)=>{
        if (err) throw err;

        console.log("Nuovo admin creato",);
      }); 
    }
  });

  req.session.user = profile;
  req.session.admin = true;
  res.sendFile(__dirname + '/private/admin/logged.html');

});



























//Socket
io.on('connection', (socket) => { 
  if(socket.request.session.admin === true){
    //Admin
    let profile = socket.request.session.user;
    let timer;

    socket.emit('profile',profile.name.givenName,profile.name.familyName);
      
    console.log(profile.emails[0].value + ' connected')

    socket.on('CreaRiunione', (titolo,descrizione) => {
      socket.join(socket.request.session.id);

      let query = "SELECT IDAdmin FROM admin WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'"
      con.query(query, (err,result)=> {
        if (err) throw err;

        socket.request.session.IDAdmin= result[0].IDAdmin;

        let password = Math.random().toString(36).substring(2,7);
        socket.emit("password", password);

        query = `INSERT INTO riunioni (IDRoom, Titolo, Descrizione, Password, IDAdmin) VALUES ('${socket.request.session.id}', '${titolo}', '${descrizione}', '${password}', '${result[0].IDAdmin}');`;
            
        con.query(query, (err, result)=> {
          if (err) throw err;
        });

        timer=setInterval(()=>{
          password = Math.random().toString(36).substring(2,7);
          socket.emit("password", password);


          let updatePasswordQuery = `UPDATE riunioni SET Password = '${password}' WHERE IDAdmin = '${result[0].IDAdmin}';`;
          con.query(updatePasswordQuery, (err, result)=> {
            if (err) throw err;
          });
        },15000);

      });
    });

    socket.on("disableTV",()=>{
      clearInterval(timer);

      let updateTVStatus = `UPDATE riunioni SET TVStatus = 'false' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
        con.query(updateTVStatus, (err, result)=> {
          if (err) throw err;
        });
    })
    socket.on("activeTV",()=>{


      let updateTVStatus = `UPDATE riunioni SET TVStatus = 'true' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
        con.query(updateTVStatus, (err, result)=> {
          if (err) throw err;
        });


      password = Math.random().toString(36).substring(2,7);
      socket.emit("password", password);


      let updatePasswordQuery = `UPDATE riunioni SET Password = '${password}' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
      con.query(updatePasswordQuery, (err, result)=> {
        if (err) throw err;
      });

      timer=setInterval(()=>{
        password = Math.random().toString(36).substring(2,7);
        socket.emit("password", password);


        let updatePasswordQuery = `UPDATE riunioni SET Password = '${password}' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
        con.query(updatePasswordQuery, (err, result)=> {
          if (err) throw err;
        });
      },15000);
    })
      
    socket.on('TerminaRiunione', () => {
          
      clearInterval(timer);

      let query = "SELECT IDAdmin FROM admin WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'"
      con.query(query, (err,result)=> {
        if (err) throw err;

        query = `DELETE FROM riunioni WHERE IDAdmin = ${result[0].IDAdmin};`;

        con.query(query, (err, result)=> {
          if (err) throw err;
        });   
      });
    });
      
    socket.on('disconnect', () => {
        console.log(profile.emails[0].value + ' disconnected')
    });
  }else{
    //user





    
  }
});


























server.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});