// src/server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport"); // Ajuste o caminho aqui
const authRoutes = require("./routes/auth"); // Supondo que você tenha esse arquivo
const todoRoutes = require("./routes/todo-routes"); // Ajuste conforme necessário
require("dotenv").config();

const app = express();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configurar o middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar a sessão
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializar o Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use("/auth", authRoutes); // Certifique-se de que esse arquivo exista
app.use("/todos", todoRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
