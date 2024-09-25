// Importa o módulo express para criar o roteador
const express = require('express');

// Importa o módulo passport para autenticação
const passport = require('passport');

// Importa o módulo bcryptjs para manipulação de senhas (não usado diretamente aqui)
const bcrypt = require('bcryptjs');

// Cria uma instância do roteador express
const router = express.Router();

// Importa o modelo User para interagir com o banco de dados
const User = require('../models/User');

// Rota para iniciar o login com Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // Solicita acesso ao perfil e email do usuário
}));

// Callback após autenticação com Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), // Redireciona para a página inicial se falhar
  (req, res) => {
    // Redireciona para a URL dos todos após autenticação bem-sucedida
    res.redirect('http://localhost:5173/todos');
  }
);

// Rota para login com email e senha
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verifica se email e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Procura o usuário pelo email
    const user = await User.findOne({ email });
    
    // Verifica se o usuário existe e se a senha está correta
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Inicia a sessão do usuário
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error logging in' });
      }
      // Retorna sucesso e dados do usuário
      res.json({ success: true, message: 'Logged in successfully', user });
    });
  } catch (err) {
    // Retorna erro do servidor se ocorrer um problema
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Rota para registro de novos usuários
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Verifica se email e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Verifica se o usuário já existe
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Cria um novo usuário
    const newUser = new User({ email, password });
    await newUser.save();

    // Inicia a sessão do novo usuário
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error logging in' });
      }
      // Retorna sucesso e dados do novo usuário
      res.json({ success: true, message: 'User registered and logged in successfully', user: newUser });
    });
  } catch (err) {
    // Retorna erro do servidor se ocorrer um problema
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Rota para logout
router.get('/logout', (req, res, next) => {
  // Encerra a sessão do usuário
  req.logout((err) => {
    if (err) { return next(err); }
    // Limpa o cookie de sessão
    res.clearCookie('connect.sid');
    // Retorna sucesso na operação de logout
    res.status(200).send({ message: 'Logged out' });
  });
});

// Rota para obter o usuário autenticado
router.get('/current_user', (req, res) => {
  // Retorna os dados do usuário autenticado
  res.json(req.user);
});

// Exporta o roteador para ser usado em outros arquivos
module.exports = router;
