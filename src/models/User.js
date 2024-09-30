const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define o esquema para o modelo User
const userSchema = new mongoose.Schema({
  // ID do Google para logins OAuth
  googleId: { type: String },

  // Nome do usuário, obrigatório e com remoção de espaços
  name: { type: String, required: true, trim: true },

  // Email único, obrigatório, e armazenado em minúsculas
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    lowercase: true, 
    trim: true,
    // Valida se o formato do email é correto
    match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um email válido.']
  },

  // Senha criptografada, obrigatória apenas se não for OAuth
  password: { type: String }
});

// Middleware pré-salvamento para criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    // Se a senha não estiver definida (caso OAuth), passa para o próximo
    if (!this.password) return next();

    const salt = await bcrypt.genSalt(10); // Rounds 10 são suficientes
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar a senha fornecida com a senha criptografada
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Modelo User baseado no schema
const User = mongoose.model('User', userSchema);

module.exports = User;
