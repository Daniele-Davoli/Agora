const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const mysql = require('mysql'); 
const { createServer } = require('http');
const { Server } = require('socket.io');
const { cpSync } = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server,{
  connectionStateRecovery: {}
});


const port=80;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agora"
});
con.connect(function(err) {
  if (err) throw err;
});

function ErrorHandler(err){
  let query = `
    INSERT INTO log (Data,Errore)
    VALUES(NOW(), "${err}");
  `
  con.query(query, (err, result) => {
    if(err) throw err;
  });

  throw err;
}

//Reset all status to Offline
con.query( `UPDATE admins SET Status = 'Offline'`,(err, result) => {
  if(err) ErrorHandler(err);
})
con.query( `UPDATE users SET Status = 'Offline'`,(err, result) => {
  if(err) ErrorHandler(err);
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
  clientID: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
  callbackURL: 'http://wyrdventures.com/user/auth/google/callback' // URL di default
}, function(token, tokenSecret, profile, done) {
  return done(null, profile);
}));
adminPassport.use(new GoogleStrategy({
  clientID: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
  callbackURL: 'http://wyrdventures.com/admin/auth/google/callback' // URL di default
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
    userPassport.authenticate('google', { failureRedirect: '/user' })(req, res, next);
  } else if(role === 'admin'){
    adminPassport.authenticate('google', { failureRedirect: '/admin' })(req, res, next);
  } else {
    res.status(404).send('Not Found');
  }
}, (req, res) => {
  const role = req.params.role;
  if (role === 'user' || role === 'admin') {
    res.redirect(`/${role}/profile`);
  } else {
    res.status(404).send('Not Found');
  }
});








//Principal Redirect
app.get('/', (req, res) => {
  res.redirect("/user")
});





//Principal Profile Redirect
app.get('/:role',(req, res) => {
  const role = req.params.role;
  if(role === "admin" || role === "user"){
    if (req.isAuthenticated()) {
      return res.redirect(`/${role}/profile`);
    }

    res.sendFile(__dirname + `/private/${role}/main.html`);
  }else{
    res.status(404).send("Not Found");
  }

});
// Rotta per visualizzare il profilo utente
app.get('/:role/profile', async(req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect(`/`);
  }

  const role = req.params.role;
  const profile=req.user;




  let CheckStatus = `
    SELECT Status
    FROM ${(role === "admin")?"admins":"users"}
    WHERE oauth_provider = '${profile.provider}' AND
          email = '${profile.emails[0].value}'
  `
  
  con.query(CheckStatus, (err, result) => {
    if(err) ErrorHandler(err);

    if(result[0]==undefined){
      let query= `
        INSERT INTO ${(role === "admin")?"admins":"users"} (Modified, Created, Picture, Email, First_name, Last_name, Oauth_provider, Status) 
        VALUES (NOW(), NOW(), ${(profile.photos[0].value==undefined)?"NULL":"'"+profile.photos[0].value+"'"}, '${profile.emails[0].value}', ${(profile.name.givenName==undefined)?"NULL":"'"+profile.name.givenName+"'"}, ${(profile.name.familyName==undefined)?"NULL":"'"+profile.name.familyName+"'"}, '${profile.provider}', 'Offline');
      `;
              
      con.query(query,(err,result)=>{
        if (err) ErrorHandler(err);

        console.log(`Nuovo ${(role === "admin")?"admin":"user"} creato`);
      }); 
    }else if(result[0].Status === 'Online'){
      return res.send('Errore, questo admin risulta già connesso. Controllare che non ci siano altre sorgenti collegate con il medesimo Account e ricaricare la pagina');
    }else if(result[0].Status === 'Offline'){
      let query = `
        UPDATE ${(role === "admin")?"admins":"users"}
        SET 
          modified = NOW(),
          picture = ${(profile.photos[0].value==undefined)?"NULL":"'"+profile.photos[0].value+"'"},
          email = '${profile.emails[0].value}',
          first_name = ${(profile.name.givenName==undefined)?"NULL":"'"+profile.name.givenName+"'"},
          last_name = ${(profile.name.familyName==undefined)?"NULL":"'"+profile.name.familyName+"'"},
          oauth_provider = '${profile.provider}',
          Status = 'Offline'
        WHERE 
          oauth_provider = '${profile.provider}' AND
          email = '${profile.emails[0].value}'
      `;
                
      con.query(query,(err,result)=>{
        if (err) ErrorHandler(err);
      });
    }
    req.session.user = profile;
    req.session.role = role;
    req.session.whitelist={
      domain: [],
      users: []
    };
    res.sendFile(__dirname + `/private/${(role === "admin")?"admin":"user"}/logged.html`);
  });
});












app.get('/user/joined', async(req, res) => {

  let CheckStatus = `
    SELECT Status
    FROM users
    WHERE oauth_provider = '${req.session.user.provider}' AND
        email = '${req.session.user.emails[0].value}'
  `
  console.log(CheckStatus);
  
  con.query(CheckStatus, (err, result) => {
    if(err) ErrorHandler(err);

    console.log(result);
    console.log(req.session.authorized);

    if(req.session.authorized === true && result[0].Status === "Offline"){
      let query;
      if(req.session.IsThereAnotherOne){
        res.sendFile(__dirname + '/private/user/joined.html');
      }else{
        query= `
          INSERT INTO listeutenti (Data_ora_ingresso, IDUser, IDRiunione)
          VALUES (NOW(),${req.session.IDRole},${req.session.IDRiunione});
        `;
        con.query(query, (err, result) => {
          if(err) ErrorHandler(err);

          res.sendFile(__dirname + '/private/user/joined.html');
        });
      }
      
    }
    else{
      res.redirect('/user');
    }
  });
}); 














//Socket
io.on('connection', (socket) => { 

  if (!socket.request.session.user) {
    return socket.disconnect();;
  }

  const role = socket.request.session.role
  const profile = socket.request.session.user;
  let query = `
    SELECT ID${(role === "admin")?"Admin":"User"} as id
    FROM ${(role === "admin")?"admins":"users"}
    WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'
  `
  con.query(query,(err, results)=>{
    if(err) ErrorHandler(err);

    socket.request.session.IDRole=results[0].id

    socket.emit('profile',profile.name.givenName,profile.name.familyName);

    con.query(`UPDATE users SET Status = 'Online' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
      if (err) ErrorHandler(err);
    });
    con.query(`UPDATE admins SET Status = 'Online' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
      if (err) ErrorHandler(err);
    });

    //Admin or User Selection
    if(role === "admin"){
      //Admin
      let timer;
      let query;

      socket.on("granted", () => {
        if(socket.request.session.riunione === true){
          socket.emit("yes");
        }else{
          query =  ` 
            SELECT COUNT(*) as num
            FROM riunioni_attive
            WHERE IDAdmin = '${socket.request.session.IDRole}'
          `;
          con.query(query,(err, results)=>{
            if(err) ErrorHandler(err);

            if(results[0].num != 0){
              query = `
                UPDATE riunioni_attive
                SET DataFine = NOW(), Validità = 'false'
                WHERE IDAdmin = '${socket.request.session.IDRole}';`;

              con.query(query, (err, result)=> {
                  if (err) ErrorHandler(err);
              });  
            }
          });
        }
      });

      socket.on("WhitelistAdd",(email)=>{
        if (email.startsWith('@')) {
          socket.request.session.whitelist.domain.push(email);
        } else {
          socket.request.session.whitelist.users.push(email);
        }
      })

      socket.on("WhitelistRemove",(email)=>{
        if (email.startsWith('@')) {
          socket.request.session.whitelist.domain = socket.request.session.whitelist.domain.filter(u => u !== email);
        } else {
          socket.request.session.whitelist.users = socket.request.session.whitelist.users.filter(u => u !== email);
        }
      })

      socket.on('CreaRiunione', (titolo,descrizione) => {
        socket.join(socket.request.session.id);
        let password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
        socket.emit("password", password);
        socket.emit("granted");
        timer=setInterval(()=>{
          password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
          socket.emit("password", password);
  
          let updatePasswordQuery = `UPDATE riunioni_attive SET Password = '${password}' WHERE IDRoom = '${socket.request.session.id}'`;
          con.query(updatePasswordQuery, (err, result)=> {
            if (err) ErrorHandler(err);
          });
        },15000);

        if(socket.request.session.riunione === true){
          query = `UPDATE riunioni_attive SET Password = '${password}', TVStatus = 'true' WHERE IDRoom = '${socket.request.session.id}'`
        
          con.query(query, (err, result)=> {
            if (err) ErrorHandler(err);
          });
        }else{
          query = `INSERT INTO riunioni (IDRoom, Titolo, Descrizione, Password, DataInizio, IDAdmin) VALUES ('${socket.request.session.id}', '${titolo}', '${descrizione}', '${password}', NOW(), '${socket.request.session.IDRole}');`;

          con.query(query, (err, result)=> {
            if (err) ErrorHandler(err);

            let IDRiunione = `
              SELECT IDRiunione
              FROM riunioni_attive
              WHERE IDRoom = '${socket.request.session.id}';
            `

            con.query(IDRiunione, (err, result)=> {
              if (err) ErrorHandler(err);
            
              socket.request.session.IDRiunione = result[0].IDRiunione;
              socket.request.session.riunione=true;
              socket.request.session.save();

              let records = socket.request.session.whitelist.users.map(user => [socket.request.session.IDRiunione, user]);

              query = `
                INSERT INTO whitelist (IDRiunione, Email) VALUES ?
                ON DUPLICATE KEY UPDATE Email=VALUES(Email);
              `;
		

              if(!records[0]){
                records = socket.request.session.whitelist.domain.map(user => [socket.request.session.IDRiunione, user]);
  
                query = `
                  INSERT INTO whitelist (IDRiunione, Domain) VALUES ?
                  ON DUPLICATE KEY UPDATE Domain=VALUES(Domain);
                `;
                  
                if(records[0]){
                  con.query(query, [records], (err, result) => {
                    if (err) ErrorHandler(err);
                  });
                }
              }else{
                console.log(records);

                con.query(query, [records], (err, result) => {
                  if (err) ErrorHandler(err);
  
                  records = socket.request.session.whitelist.domain.map(user => [socket.request.session.IDRiunione, user]);
  
                  query = `
                    INSERT INTO whitelist (IDRiunione, Domain) VALUES ?
                    ON DUPLICATE KEY UPDATE Domain=VALUES(Domain);
                  `;
                  if(records[0]){
                    con.query(query, [records], (err, result) => {
                      if (err) ErrorHandler(err);
                    });
                  }
                });
              }
            });
          });
        }
      });
      socket.on('TerminaRiunione', () => {  
        clearInterval(timer);
  
        query = `
          UPDATE riunioni_attive
          SET DataFine = NOW()
          WHERE IDRoom = '${socket.request.session.id}';
        `;
  
        con.query(query, (err, result)=> {
          if (err) ErrorHandler(err);
  
          query = `
            UPDATE listeutenti
            SET Data_ora_uscita = NOW()
            WHERE IDRiunione = ${socket.request.session.IDRiunione} AND Data_ora_uscita IS NULL
          `;
          con.query(query, (err, result)=> {
              if (err) ErrorHandler(err);

              socket.request.session.riunione=false;
              socket.request.session.IDRiunione=null;
              socket.request.session.save();
          });
        });   
      });

      socket.on("disableTV",()=>{
        clearInterval(timer);
  
        let updateTVStatus = `UPDATE riunioni_attive SET TVStatus = 'false' WHERE IDAdmin = '${socket.request.session.IDRole}';`;
        con.query(updateTVStatus, (err, result)=> {
          if (err) ErrorHandler(err);
        });
      })
      socket.on("activeTV",()=>{
        let updateTVStatus = `UPDATE riunioni_attive SET TVStatus = 'true' WHERE IDAdmin = '${socket.request.session.IDRole}';`;
        con.query(updateTVStatus, (err, result)=> {
          if (err) ErrorHandler(err);
        });
  
        let password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
        socket.emit("password", password);
  
  
        let updatePasswordQuery = `UPDATE riunioni_attive SET Password = '${password}' WHERE IDRoom = '${socket.request.session.id}'`;
        con.query(updatePasswordQuery, (err, result)=> {
          if (err) ErrorHandler(err);
        });
  
        timer=setInterval(()=>{
          password = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
          socket.emit("password", password);
  
          let updatePasswordQuery = `UPDATE riunioni_attive SET Password = '${password}' WHERE IDRoom = '${socket.request.session.id}'`;
          con.query(updatePasswordQuery, (err, result)=> {
            if (err) ErrorHandler(err);
          });
        },15000);
      })

      socket.on("Domanda",(msg)=>{

        io.to(socket.request.session.id).emit("StopDomanda");

        query= `
          INSERT INTO domande(Testo,DataInizio,IDRiunione)
          VALUES ('${msg}', NOW(), ${socket.request.session.IDRiunione});
        `
        con.query(query, (err, result)=> {
          if (err) {
            console.log("ciao");
            ErrorHandler(err);
            
          } 
          socket.request.session.IDDomanda=result.insertId;
          io.to(socket.request.session.id).emit("Domanda", msg, result.insertId);
        });
      })
      socket.on("Aggiorna",()=> {

          let first=`
            SELECT COUNT(*) as num
            FROM  risposte
            WHERE Risposta LIKE "si" AND IDDomanda = ${socket.request.session.IDDomanda}
          `
          con.query(first, (err, result)=> {
            if (err) ErrorHandler(err);
            if(result){
              first=result[0].num;

              let second=`
                SELECT COUNT(*) as num
                FROM  risposte
                WHERE Risposta LIKE 'mi astengo' AND IDDomanda = ${socket.request.session.IDDomanda}
              `
              con.query(second, (err, result)=> {
                if (err) ErrorHandler(err);
                if(result)second=result[0].num;

                let third=`
                  SELECT COUNT(*) as num
                  FROM  risposte
                  WHERE Risposta LIKE 'no' AND IDDomanda = ${socket.request.session.IDDomanda}
                `
                con.query(third, (err, result)=> {
                  if (err) ErrorHandler(err);
                  if(result)third=result[0].num;

                  console.log(first, second, third);

                  socket.emit("Aggiorna",[first, second, third])
                });
              });
            }
          });
      })
      socket.on("StopDomanda",()=>{
        io.to(socket.request.session.id).emit("StopDomanda");
        query = `
          UPDATE domande
          SET DataFine = NOW()
          WHERE IDRiunione = ${socket.request.session.IDRiunione} AND DataFine IS NULL
        `;
        con.query(query, (err, result)=> {
          if (err) ErrorHandler(err);
        });
      });
      

      socket.on("logout", ()=>{
        socket.emit("logout");
        socket.disconnect();
      })
      socket.on('disconnect', () => {
        clearInterval(timer);

        con.query(`UPDATE users SET Status = 'Offline' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
          if (err) ErrorHandler(err);
        });
        con.query(`UPDATE admins SET Status = 'Offline' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
          if (err) ErrorHandler(err);
        });
      });
    }else{
      //User
      let query;

      query = `
        SELECT IDRiunione as num
        FROM listeutenti
        WHERE IDUser = ${socket.request.session.IDRole} AND Data_ora_uscita IS NULL
      `

      con.query(query, (err, result)=> {
        if (err) ErrorHandler(err);

	console.log(result)

        if(result[0]){
          socket.emit("redirect");

          socket.request.session.IsThereAnotherOne = true;

          socket.request.session.authorized=true;
          socket.request.session.IDRiunione = result[0].num;

          let queryInfo=`SELECT * FROM riunioni_attive WHERE IDRiunione = '${socket.request.session.IDRiunione}'`;
          con.query(queryInfo, (err,result)=> {
            if (err) ErrorHandler(err);

		console.log(result)

            socket.request.session.IDRoom=result[0].IDRoom;
            socket.request.session.save();

            socket.emit("InfoRiunione",result[0].Titolo,profile.name.givenName,profile.name.familyName,result[0].Descrizione)
            socket.join(socket.request.session.IDRoom);
          });

          socket.on("Risposta",(msg, idDomanda)=>{
            if(idDomanda){
              query=`
                SELECT COUNT(*) as num
                FROM risposte
                WHERE IDDomanda = ${idDomanda} AND IDUser = ${socket.request.session.IDRole}
              `
              con.query(query, (err, result)=> {
                if (err) ErrorHandler(err);

                if(result[0].num == 0){
                  query=`
                    INSERT INTO risposte(Risposta, IDUser, IDDomanda)
                    VALUES ('${msg}', ${socket.request.session.IDRole}, ${idDomanda});
                  `
                  con.query(query, (err, result)=> {
                    if (err) ErrorHandler(err);

                    socket.to(socket.request.session.IDRoom).emit("Aggiorna","");
                  });
                }
              });
            }
          });
          
    
        }else{
          query = `
            SELECT IDRoom,Titolo
            FROM riunioni_attive
          `;
          con.query(query, (err, result)=> {
            if (err) ErrorHandler(err);

            socket.emit("ListaRiunioni", result);
          });

          socket.on("Password",(pw,IDRoom) => {
            let query = `SELECT COUNT(*) as num FROM riunioni_attive WHERE IDRoom = '${IDRoom}' AND Password = '${pw}' AND TVStatus = true;`;
            con.query(query, (err,result)=> {
              if (err) ErrorHandler(err);
      
              if(result[0].num != 0){
                socket.request.session.IDRoom = IDRoom;
                let IDRiunione = `
                  SELECT IDRiunione
                  FROM riunioni_attive
                  WHERE IDRoom = '${IDRoom}';
                `
                con.query(IDRiunione, (err,result)=> {
                  if (err) ErrorHandler(err);
                  socket.request.session.IDRiunione = result[0].IDRiunione;
          
                  /*Check Whitelist*/

                  query = `SELECT COUNT(*) as num FROM whitelist WHERE Email = '${profile.emails[0].value}' AND IDRiunione = ${result[0].IDRiunione}`
                  con.query(query, (err, result)=> {
                    if (err) ErrorHandler(err);
                    if (result[0].num === 0){
                      const domain = "@" + profile.emails[0].value.split("@")[1];
                      query = `SELECT COUNT(*) as num FROM whitelist WHERE Domain = '${domain}' AND IDRiunione = ${socket.request.session.IDRiunione}`
                      con.query(query, (err, result)=> {
                        if (err) ErrorHandler(err);
                        if (result[0].num === 0){
                          socket.emit("errPassword");
                          return
                        } else keepGoing()
                      });
                    }else keepGoing()
                  });
                  /*Check Whitelist*/

                  function keepGoing(){
                    query = `
                      SELECT COUNT(*) as num
                      FROM listeutenti
                      WHERE IDRiunione = '${result[0].IDRiunione}' AND IDUser = '${socket.request.session.IDRole}'
                    `
                    con.query(query, (err, result)=> {
                      if (err) ErrorHandler(err);
    
                      

                      if(result[0].num == 0){

                        con.query(`UPDATE admins SET Status = 'Offline' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
                          if (err) ErrorHandler(err);
                        });
                        con.query(`UPDATE users SET Status = 'Offline' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
                          if (err) ErrorHandler(err);

                          socket.request.session.authorized = true;
                          socket.request.session.save();
                          socket.emit("redirect");
                        });
                      }else{
                        socket.emit("errPassword");
                      }
                    });
                  }
                });
              }else{
                socket.emit("errPassword");
              }
            }); 
          })
        }
      });

      

      socket.on("logout", ()=>{
        query = `
          UPDATE listeutenti
          SET Data_ora_uscita = NOW()
          WHERE IDRiunione = ${socket.request.session.IDRiunione} AND Data_ora_uscita IS NULL AND IDUser = ${socket.request.session.IDRole}
        `;
        con.query(query, (err, result)=> {
          if (err) ErrorHandler(err)
          socket.request.session.authorized=false;
          socket.request.session.save();
          socket.disconnect();
        });
      })
      socket.on('disconnect', () => {
        con.query(`UPDATE admins SET Status = 'Offline' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
          if (err) ErrorHandler(err);
        });
        con.query(`UPDATE users SET Status = 'Offline' WHERE oauth_provider = '${profile.provider}' AND email = '${profile.emails[0].value}'`, (err, result)=> {
          if (err) ErrorHandler(err);
        });
      });
    }
  });
});


















server.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});
