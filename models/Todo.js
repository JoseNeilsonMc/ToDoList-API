// Importa o módulo mongoose para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');
// Cria uma instância de Schema do mongoose
const Schema = mongoose.Schema;
// Define o esquema para o modelo Todo
const todoSchema = new Schema({
  // O campo userId faz referência a um documento da coleção 'User' (relacionamento entre modelos)
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
  // O campo text armazena o texto da tarefa
  text: String, 
  // O campo category armazena a categoria da tarefa
  category: String,
  // O campo isCompleted armazena o status de conclusão da tarefa, por padrão falso (não concluída)
  isCompleted: { type: Boolean, default: false }
});
// Cria um modelo 'Todo' baseado no esquema todoSchema
const Todo = mongoose.model('Todo', todoSchema);
// Exporta o modelo Todo para ser usado em outros arquivos
module.exports = Todo;
