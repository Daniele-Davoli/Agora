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
  resave: false,
  saveUninitialized: true,
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);





const userPassport = new passport.Passport();
const adminPassport = new passport.Passport();


userPassport.serializeUser((user, done) => {
  done(null, user);
});
userPassport.deserializeUser((obj, done) => {
  done(null, obj);
});
adminPassport.serializeUser((user, done) => {
  done(null, user);
});
adminPassport.deserializeUser((obj, done) => {
  done(null, obj);
});


userPassport.use(new GoogleStrategy({
  clientID: '382797113950-puuvr948htop43ii77t4bn99966smdf6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost/user/auth/google/callback' // URL di default
}, function(token, tokenSecret, profile, done) {
  return done(null, profile);
}));
adminPassport.use(new GoogleStrategy({
  clientID: '382797113950-puuvr948htop43ii77t4bn99966smdf6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost/admin/auth/google/callback' // URL di default
}, function(token, tokenSecret, profile, done) {
  return done(null, profile);
}));


app.use(userPassport.initialize());
app.use(userPassport.session());
app.use(adminPassport.initialize());
app.use(adminPassport.session());








//Autentificazione
app.get('/:role/auth/google', (req, res, next) => {
  const role = req.params.role;
  if (role === 'user') {
    userPassport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } else if(role === 'admin'){
    adminPassport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } else {
    res.status(404).send('Not Found');
  }
});
app.get('/:role/auth/google/callback', (req, res, next) => {
  const role = req.params.role;
  if (role === 'user') {
    userPassport.authenticate('google', { failureRedirect: '/' })(req, res, next);
  } else if(role === 'admin'){
    adminPassport.authenticate('google', { failureRedirect: '/admin' })(req, res, next);
  } else {
    res.status(404).send('Not Found');
  }
}, (req, res) => {
  const role = req.params.role;
  if (role === 'user') {
    res.redirect('/userProfile');
  } else if (role === 'admin') {
    res.redirect('/adminProfile');
  }
});







//Users
app.get('/',async(req, res) => {
  res.sendFile(__dirname + '/private/user/main.html');
});

// Rotta per visualizzare il profilo utente
app.get('/userProfile', async(req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  let profile=req.user;

  con.query("SELECT COUNT(*) as num FROM users WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'",(err,result)=>{
    if (err) throw err;

    if(result[0].num != 0){
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
        INSERT INTO users (modified, created, picture, email, first_name, oauth_uid, oauth_provider) 
        VALUES (NOW(), NOW(), '${profile.photos[0].value}', '${profile.emails[0].value}', '${profile.name.givenName}', '${profile.id}', '${profile.provider}');
        `;        
      con.query(query,(err,result)=>{
        if (err) throw err;
        console.log("Nuovo utente creato",);
      });
    }
  });


  req.session.user = profile;
  req.session.admin = false;
  req.session.authorized=false;
  res.sendFile(__dirname + '/private/user/logged.html');
});
app.get('/user/joined', async(req, res) => {
  if(req.session.authorized === true){
    res.sendFile(__dirname + '/private/user/joined.html');
  }
  else{
    res.redirect('/');
  }
}); 























//Admins
app.get('/admin',async(req, res) => {
  res.sendFile(__dirname + '/private/admin/main.html');
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
  let profile = socket.request.session.user;

  if(socket.request.session.admin === true){
    //Admin
    let timer;

    socket.emit('profile',profile.name.givenName,profile.name.familyName);
      
    console.log("admin: "+profile.emails[0].value + ' connected')

    socket.on('CreaRiunione', (titolo,descrizione) => {
      socket.join(socket.request.session.id);

      let query = "SELECT IDAdmin FROM admin WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'"
      con.query(query, (err,result)=> {
        if (err) throw err;

        socket.request.session.IDAdmin= result[0].IDAdmin;

        let password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
        socket.emit("password", password);

        query = `INSERT INTO riunioni (IDRoom, Titolo, Descrizione, Password, IDAdmin) VALUES ('${socket.request.session.id}', '${titolo}', '${descrizione}', '${password}', '${result[0].IDAdmin}');`;
            
        con.query(query, (err, result)=> {
          if (err) throw err;
        });

        timer=setInterval(()=>{
          password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
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


      password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
      socket.emit("password", password);


      let updatePasswordQuery = `UPDATE riunioni SET Password = '${password}' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
      con.query(updatePasswordQuery, (err, result)=> {
        if (err) throw err;
      });

      timer=setInterval(()=>{
        password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
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
  }else if(socket.request.session.admin === false){
    //user
    console.log('user: '+profile.emails[0].value + ' connected')


    if(socket.request.session.authorized){

      let queryInfo=`SELECT * FROM riunioni WHERE IDRoom = '${socket.request.session.IDRoom}'`;
      con.query(queryInfo, (err,result)=> {
        if (err) throw err;

        socket.emit("InfoRiunione",result[0].Titolo,profile.name.givenName,profile.name.familyName,result[0].Descrizione)
      });
      socket.join(socket.request.session.IDRoom);

    }else{
      socket.on("Password",(pw,IDRoom) => {
        let query = `SELECT COUNT(*) as num FROM riunioni WHERE IDRoom = '${IDRoom}' AND Password = '${pw}';`;
        con.query(query, (err,result)=> {
          if (err) throw err;
  
          if(result[0].num != 0){
            socket.request.session.authorized = true;
            socket.request.session.IDRoom = IDRoom;
            socket.request.session.save();
            socket.emit("redirect");
          } else{
            socket.emit("errPassword");
          }
        }); 
      })
    }

    socket.on('disconnect', () => {
      console.log(profile.emails[0].value + ' disconnected')
    });
  }
});


























server.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});