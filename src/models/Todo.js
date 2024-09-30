const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define o esquema para o modelo Todo
const todoSchema = new Schema({
  // userId referencia o modelo 'User' e é obrigatório
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Texto da tarefa é obrigatório e terá espaços removidos no início e fim
  text: { type: String, required: true, trim: true },
  
  // Categoria da tarefa (opcional) com validação de enum
  category: { 
    type: String, 
    enum: ['trabalho', 'pessoal', 'outros'], 
    default: 'outros' 
  },
  
  // Status de conclusão da tarefa (padrão: falso)
  isCompleted: { type: Boolean, default: false },

  // Data de criação e atualização automáticas
}, { timestamps: true });

// Adiciona índices para o campo userId para melhorar a performance em consultas
todoSchema.index({ userId: 1 });

// Cria um modelo 'Todo' baseado no esquema todoSchema
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
