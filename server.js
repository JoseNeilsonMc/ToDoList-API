const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

require('./config/passport-setup');

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

const todoRoutes = require('./routes/todo-routes');
const authRoutes = require('./routes/auth-routes');

app.use('/api', todoRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`));
