const passport = require("passport");
const googleStrategy = require("./strategies/googleStrategy");

// Serialização do usuário para armazenar na sessão
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserialização para recuperar o usuário da sessão
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch(done);
});

// Adiciona a estratégia do Google ao passport
googleStrategy(passport);

module.exports = passport;
