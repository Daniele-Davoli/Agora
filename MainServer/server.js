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
let ChangeAllStatus = `
  UPDATE admin
  SET Status = 'Offline'
`
con.query(ChangeAllStatus,(err, result) => {
  if(err) throw err;
})


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
  clientSecret: '',
  callbackURL: '' // URL di default
}, function(token, tokenSecret, profile, done) {
  return done(null, profile);
}));
adminPassport.use(new GoogleStrategy({
  clientID: '',
  clientSecret: '',
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
  } else {
    res.status(404).send('Not Found');
  }
});












//Users
app.get('/',(req, res) => {
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

  let queryID= `
    SELECT id
    FROM users
    WHERE email = '${profile.emails[0].value}';
  `;

  con.query(queryID,(err,result)=>{
    if (err) throw err;
    req.session.iduser=result[0].id;
    req.session.user = profile;
    req.session.admin = false;
    req.session.authorized=false;
    res.sendFile(__dirname + '/private/user/logged.html');
  });
  
});
app.get('/user/joined', async(req, res) => {
  if(req.session.authorized === true){
    let IDRiunione = `
      SELECT IDRiunione
      FROM riunioni_attive
      WHERE IDRoom = '${req.session.IDRoom}';
      `
    con.query(IDRiunione, (err, result) => {
      if(err) throw err;
      let query = `
        INSERT INTO listeutenti (Data_ora_ingresso, IDUtente, IDRiunione)
        VALUES (NOW(),${req.session.iduser},${result[0].IDRiunione});
        `;
      req.session.IDRiunione = result[0].IDRiunione;
      con.query(query, (err, result) => {
        if(err) throw err;

        res.sendFile(__dirname + '/private/user/joined.html');
      });
    });
  }
  else{
    res.redirect('/');
  }
}); 









//Admin
app.get('/admin',(req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/adminProfile');
  }
  res.sendFile(__dirname + '/private/admin/main.html');
});

// Rotta per visualizzare il profilo admin
app.get('/adminProfile', async(req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin');
  }
  let profile=req.user;

  let CheckStatus = `
    SELECT Status
    FROM admin
    WHERE oauth_provider = '${profile.provider}' AND 
          first_name = '${profile.name.givenName}' AND 
          email = '${profile.emails[0].value}'`
  
  con.query(CheckStatus, (err, result) => {
    if(err) throw err;

    if(result[0]==undefined){
      let query= `
        INSERT INTO admin (modified, created, picture, email, first_name, last_name, oauth_uid, oauth_provider, Status) 
        VALUES (NOW(), NOW(), ${(profile.photos[0].value==undefined)?"NULL":"'"+profile.photos[0].value+"'"}, '${profile.emails[0].value}', ${(profile.name.givenName==undefined)?"NULL":"'"+profile.name.givenName+"'"}, ${(profile.name.familyName==undefined)?"NULL":"'"+profile.name.familyName+"'"}, '${profile.id}', '${profile.provider}', 'Online');
        `;
              
      con.query(query,(err,result)=>{
        if (err) throw err;

        console.log("Nuovo admin creato",);
      }); 
    }else if(result[0].Status === 'Online'){
      return res.send('Errore, questo admin risulta già connesso. Controllare che non ci siano altre sorgenti collegate con il medesimo Account e ricaricare la pagina');
    }else if(result[0].Status === 'Offline'){
      let query = `
        UPDATE admin 
        SET 
          modified = NOW(),
          picture = ${(profile.photos[0].value==undefined)?"NULL":"'"+profile.photos[0].value+"'"},
          email = '${profile.emails[0].value}',
          first_name = ${(profile.name.givenName==undefined)?"NULL":"'"+profile.name.givenName+"'"},
          last_name = ${(profile.name.familyName==undefined)?"NULL":"'"+profile.name.familyName+"'"},
          oauth_uid = '${profile.id}',
          oauth_provider = '${profile.provider}',
          Status = 'Online'
        WHERE 
          oauth_provider = '${profile.provider}' AND 
          first_name = '${profile.name.givenName}' AND 
          email = '${profile.emails[0].value}'
        `;
                
      con.query(query,(err,result)=>{
        if (err) throw err;
      });
    }

    req.session.user = profile;
    req.session.admin = true;
    res.sendFile(__dirname + '/private/admin/logged.html');
  });
});












//Socket
io.on('connection', (socket) => { 
  let profile = socket.request.session.user;

  if(socket.request.session.admin === true){
    //Admin
    let timer;

    socket.emit('profile',profile.name.givenName,profile.name.familyName);
      
    console.log("admin: "+profile.emails[0].value + ' connected')

    socket.on("granted", () => {
      if(socket.request.session.riunione === true){
        socket.emit("yes");
      }else{

        let query = `
          SELECT IDAdmin
          FROM admin
          WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'
          `
        con.query(query,(err, results)=>{
          if(err) throw err;

          query =  ` 
            SELECT COUNT(*) as num
            FROM riunioni_attive
            WHERE IDAdmin = '${results[0].IDAdmin}'
            `;

          socket.request.session.IDAdmin = results[0].IDAdmin;

          con.query(query,(err, results)=>{
            if(err) throw err;

            if(results[0].num != 0){
              query = `
                UPDATE riunioni_attive
                SET DataFine = NOW(), Validità = 'false'
                WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;

              con.query(query, (err, result)=> {
                  if (err) throw err;

                  console.log("Riunione invalida creata!");
              });  
            }
          });
        });
      }
    })

    socket.on("logout", ()=>{
      socket.emit("logout");
      socket.disconnect();
    })

    socket.on('CreaRiunione', (titolo,descrizione) => {
      socket.join(socket.request.session.id);

      let query = "SELECT IDAdmin FROM admin WHERE oauth_provider = '"+profile.provider+"' AND email = '"+profile.emails[0].value+"'"
      con.query(query, (err,result)=> {
        if (err) throw err;

        socket.request.session.IDAdmin= result[0].IDAdmin;

        let password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
        socket.emit("password", password);
        socket.emit("granted");
            
        if(socket.request.session.riunione === true){
          query = `UPDATE riunioni_attive SET Password = '${password}', TVStatus = 'true' WHERE IDRoom = '${socket.request.session.id}'`
        
          con.query(query, (err, result)=> {
            if (err) throw err;
          });
        }else{
          query = `INSERT INTO riunioni (IDRoom, Titolo, Descrizione, Password, DataInizio, IDAdmin) VALUES ('${socket.request.session.id}', '${titolo}', '${descrizione}', '${password}', NOW(), '${result[0].IDAdmin}');`;

          con.query(query, (err, result)=> {
            if (err) throw err;

            let IDRiunione = `
            SELECT IDRiunione
            FROM riunioni_attive
            WHERE IDRoom = '${socket.request.session.id}';
            `

            con.query(IDRiunione, (err, result)=> {
              if (err) throw err;
            
              socket.request.session.IDRiunione = result[0].IDRiunione;
              socket.request.session.riunione=true;
              socket.request.session.save();
            });
          });
        }

        timer=setInterval(()=>{
          password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
          socket.emit("password", password);


          let updatePasswordQuery = `UPDATE riunioni_attive SET Password = '${password}' WHERE IDRoom = '${socket.request.session.id}'`;
          con.query(updatePasswordQuery, (err, result)=> {
            if (err) throw err;
          });
        },15000);

      });
    });

    socket.on("disableTV",()=>{
      clearInterval(timer);

      let updateTVStatus = `UPDATE riunioni_attive SET TVStatus = 'false' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
        con.query(updateTVStatus, (err, result)=> {
          if (err) throw err;
        });
    })
    socket.on("activeTV",()=>{


      let updateTVStatus = `UPDATE riunioni_attive SET TVStatus = 'true' WHERE IDAdmin = '${socket.request.session.IDAdmin}';`;
        con.query(updateTVStatus, (err, result)=> {
          if (err) throw err;
        });


      password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
      socket.emit("password", password);


      let updatePasswordQuery = `UPDATE riunioni_attive SET Password = '${password}' WHERE IDRoom = '${socket.request.session.id}'`;
      con.query(updatePasswordQuery, (err, result)=> {
        if (err) throw err;
      });

      timer=setInterval(()=>{
        password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
        socket.emit("password", password);


        let updatePasswordQuery = `UPDATE riunioni_attive SET Password = '${password}' WHERE IDRoom = '${socket.request.session.id}'`;
        con.query(updatePasswordQuery, (err, result)=> {
          if (err) throw err;
        });
      },15000);
    })
      
    socket.on('TerminaRiunione', () => {

      socket.request.session.riunione=false;
      socket.request.session.save();

      clearInterval(timer);

      query = `
        UPDATE riunioni_attive
        SET DataFine = NOW()
        WHERE IDRoom = '${socket.request.session.id}';`;

      con.query(query, (err, result)=> {
        if (err) throw err;

        query = `
          UPDATE listeutenti
          SET Data_ora_uscita = NOW()
          WHERE IDRiunione = ${socket.request.session.IDRiunione} AND Data_ora_uscita IS NULL
        `;
        con.query(query, (err, result)=> {
            if (err) throw err;
        });
      });   
    });
      
    socket.on('disconnect', () => {
        clearInterval(timer);

        let query = `
          UPDATE admin 
          SET Status = 'Offline' 
          WHERE oauth_provider = '${profile.provider}' AND 
                first_name = '${profile.name.givenName}' AND 
                email = '${profile.emails[0].value}'
          `;
        con.query(query, (err, result)=> {
          if (err) throw err;
        });

        console.log('admin: '+profile.emails[0].value + ' disconnected')
    });
  }else if(socket.request.session.admin === false){
    //user
    console.log('user: '+profile.emails[0].value + ' connected')


    if(socket.request.session.authorized){

      let queryInfo=`SELECT * FROM riunioni_attive WHERE IDRoom = '${socket.request.session.IDRoom}'`;
      con.query(queryInfo, (err,result)=> {
        if (err) throw err;

        socket.emit("InfoRiunione",result[0].Titolo,profile.name.givenName,profile.name.familyName,result[0].Descrizione)
      });
      socket.join(socket.request.session.IDRoom);

    }else{
      socket.on("Password",(pw,IDRoom) => {
        let query = `SELECT COUNT(*) as num FROM riunioni_attive WHERE IDRoom = '${IDRoom}' AND Password = '${pw}' AND TVStatus = true;`;
        con.query(query, (err,result)=> {
          if (err) throw err;
  
          if(result[0].num != 0){

            let IDRiunione = `
              SELECT IDRiunione
              FROM riunioni_attive
              WHERE IDRoom = '${IDRoom}';
              `
            con.query(IDRiunione, (err,result)=> {
              if (err) throw err;

              query = `
                SELECT COUNT(*) as num
                FROM listeutenti
                WHERE IDRiunione = '${result[0].IDRiunione}' AND IDUtente = '${socket.request.session.iduser}'
              `
              console.log(query)
              con.query(query, (err, result)=> {
                if (err) throw err;
                console.log(result)
                if(result[0].num == 0){
                  socket.request.session.authorized = true;
                  socket.request.session.IDRoom = IDRoom;
                  socket.request.session.save();
                  socket.emit("redirect");
                }else{
                  socket.emit("logout");
                }
              });
            });
          } else{
            socket.emit("errPassword");
          }
        }); 
      })
    }
    socket.on("logout", ()=>{
      query = `
          UPDATE listeutenti
          SET Data_ora_uscita = NOW()
          WHERE IDRiunione = ${socket.request.session.IDRiunione} AND Data_ora_uscita IS NULL AND IDUtente = ${socket.request.session.iduser}
        `;
      con.query(query, (err, result)=> {
        if (err) throw err;
        
        socket.disconnect();
      });
    })

    socket.on('disconnect', () => {
      console.log('user: '+profile.emails[0].value + ' disconnected')
    });
  }
});


























server.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});
