const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Cria uma instância do roteador express
const router = express.Router();

// Rota para iniciar o login com Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // Solicita acesso ao perfil e email do usuário
}));

// Callback após autenticação com Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res) => {
    // Redireciona para a página de todos após login bem-sucedido
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

    // Verifica se o usuário existe e a senha está correta
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Inicia a sessão do usuário
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error logging in' });
      }
      res.json({ success: true, message: 'Logged in successfully', user });
    });
  } catch (err) {
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
      res.json({ success: true, message: 'User registered and logged in successfully', user: newUser });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Rota para logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).send({ message: 'Logged out' });
  });
});

// Rota para obter o usuário autenticado (rota protegida)
router.get('/current_user', (req, res) => {
  // Verifica se o usuário está autenticado
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ message: 'No user authenticated' });
});

// Exporta o roteador para ser usado em outros arquivos
module.exports = router;
