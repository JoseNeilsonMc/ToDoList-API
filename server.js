// Importa os módulos necessários
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma instância do aplicativo Express
const app = express();

// Configura o CORS para permitir solicitações do frontend
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend permitido
  credentials: true, // Permite cookies e credenciais
}));

// Configura o middleware para parsing de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura a sessão para manter o estado do usuário
app.use(session({
  secret: process.env.SESSION_SECRET, // Segredo para criptografia de sessão
  resave: false, // Não re-salvar a sessão se não houver alterações
  saveUninitialized: true, // Salva sessões novas, mesmo que não inicializadas
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // Define a expiração do cookie (1 dia)
}));

// Configura o Passport para autenticação
require('./config/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

// Conecta ao banco de dados MongoDB usando a URI do ambiente
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB')) // Mensagem de sucesso
  .catch(err => console.error('Error connecting to MongoDB', err)); // Mensagem de erro

// Importa as rotas
const todoRoutes = require('./routes/todo-routes');
const authRoutes = require('./routes/auth-routes');

// Configura as rotas para as APIs
app.use('/api', todoRoutes);
app.use('/auth', authRoutes);

// Rota principal para verificar se a API está em execução
app.get('/', (req, res) => {
  res.send('API is running');
});

// Define a porta para o servidor
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)); // Mensagem de sucesso ao iniciar o servidor
