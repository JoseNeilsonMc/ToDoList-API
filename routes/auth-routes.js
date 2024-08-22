const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// Rota para login com Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback após autenticação com Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173/todos');
  }
);

// Rota para login com email e senha
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

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

// Rota para registro
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

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
    res.clearCookie('connect.sid');
    res.status(200).send({ message: 'Logged out' });
  });
});

// Rota para obter usuário autenticado
router.get('/current_user', (req, res) => {
  res.json(req.user);
});

module.exports = router;
