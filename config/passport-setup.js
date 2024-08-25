// Importa o módulo 'passport' para autenticação
const passport = require('passport');

// Importa a estratégia de autenticação do Google OAuth 2.0
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Importa o modelo 'User' que será usado para interagir com o banco de dados
const User = require('../models/User');

// Função para serializar o usuário - armazena o ID do usuário na sessão
passport.serializeUser((user, done) => {
  // Armazena o ID do usuário na sessão para identificar o usuário autenticado em requisições futuras
  done(null, user.id);
});

// Função para desserializar o usuário - recupera o usuário a partir do ID armazenado na sessão
passport.deserializeUser((id, done) => {
  // Procura o usuário no banco de dados pelo ID armazenado na sessão
  User.findById(id)
    .then((user) => {
      // Se o usuário for encontrado, ele é retornado
      done(null, user);
    })
    // Se ocorrer um erro, ele é passado para o callback 'done'
    .catch(done);
});

// Define a estratégia de autenticação usando o Google OAuth 2.0
passport.use(new GoogleStrategy({
  // Configurações da estratégia: usa as credenciais do Google (ID do cliente, segredo e URL de callback)
  clientID: process.env.GOOGLE_CLIENT_ID,       // O ID do cliente fornecido pelo Google (armazenado em variáveis de ambiente)
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // O segredo do cliente fornecido pelo Google (armazenado em variáveis de ambiente)
  callbackURL: '/auth/google/callback'           // A URL para onde o Google redireciona após a autenticação
}, 
// Função de callback que é chamada após o Google autenticar o usuário
async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifica se o usuário já existe no banco de dados procurando pelo ID do Google
    let user = await User.findOne({ googleId: profile.id });

    // Se o usuário não for encontrado, cria um novo usuário
    if (!user) {
      user = new User({
        googleId: profile.id,            // Armazena o ID do Google do usuário
        username: profile.displayName,   // Armazena o nome exibido pelo Google
        email: profile.emails[0].value   // Armazena o primeiro email associado à conta Google do usuário
      });
      
      // Salva o novo usuário no banco de dados
      await user.save();
    }

    // Retorna o usuário autenticado
    done(null, user);
  } catch (error) {
    // Se ocorrer algum erro durante o processo, o erro é retornado para o callback 'done'
    done(error);
  }
}));
