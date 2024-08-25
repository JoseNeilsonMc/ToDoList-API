// Importa o módulo mongoose para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

// Importa o módulo bcryptjs para criptografar e comparar senhas
const bcrypt = require('bcryptjs');

// Define o esquema para o modelo User
const userSchema = new mongoose.Schema({
  // O campo googleId armazena o ID do usuário do Google
  googleId: String,
  
  // O campo name armazena o nome do usuário
  name: String,
  
  // O campo email armazena o email do usuário, deve ser único e obrigatório
  email: { type: String, unique: true, required: true },
  
  // O campo password armazena a senha criptografada do usuário
  password: String,
});

// Middleware pré-salvamento para criptografar a senha antes de salvar no banco de dados
userSchema.pre('save', async function (next) {
  // Verifica se o campo password foi modificado
  if (!this.isModified('password')) return next();
  try {
    // Gera um salt para a criptografia
    const salt = await bcrypt.genSalt(10);
    // Criptografa a senha usando o salt
    this.password = await bcrypt.hash(this.password, salt);
    // Continua com o processo de salvamento
    next();
  } catch (err) {
    // Passa o erro para o próximo middleware ou manipulador de erro
    next(err);
  }
});

// Método para comparar a senha fornecida com a senha criptografada
userSchema.methods.comparePassword = function(candidatePassword) {
  // Compara a senha fornecida com a senha criptografada armazenada
  return bcrypt.compare(candidatePassword, this.password);
};

// Cria um modelo 'User' baseado no esquema userSchema
const User = mongoose.model('User', userSchema);

// Exporta o modelo User para ser usado em outros arquivos
module.exports = User;


