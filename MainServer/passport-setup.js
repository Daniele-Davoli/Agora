const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 'KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: '/auth/google/callback'
},function(token, tokenSecret, profile, done) {

    
    
    
      
      
      //response=req['credential'].split(".");
      //let responsePayload=JSON.parse(atob(response[1]));

    

    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
