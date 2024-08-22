const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  category: String,
  isCompleted: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
