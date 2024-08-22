const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const Todo = require('../models/Todo');

const router = express.Router();

// Buscar tarefas do usuário autenticado
router.get('/todos', ensureAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.send(todos);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching todos' });
  }
});

// Criar nova tarefa
router.post('/todos', ensureAuthenticated, async (req, res) => {
  try {
    const { text, category } = req.body;
    const todo = new Todo({
      text,
      category,
      userId: req.user._id
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Error creating todo' });
  }
});

// Atualizar tarefa
router.put('/todos/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { isCompleted } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isCompleted },
      { new: true }
    );
    if (!todo) {
      return res.status(404).send({ error: 'Todo not found' });
    }
    res.send(todo);
  } catch (error) {
    res.status(500).send({ error: 'Error updating todo' });
  }
});

// Remover tarefa
router.delete('/todos/:id', ensureAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      return res.status(404).send({ error: 'Todo not found' });
    }
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Error deleting todo' });
  }
});

module.exports = router;
