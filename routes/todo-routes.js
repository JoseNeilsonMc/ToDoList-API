// Importa o módulo express para criar o roteador
const express = require('express');

// Importa o middleware para garantir que o usuário está autenticado
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// Importa o modelo Todo para interagir com o banco de dados
const Todo = require('../models/Todo');

// Cria uma instância do roteador express
const router = express.Router();

// Rota para buscar todas as tarefas do usuário autenticado
router.get('/todos', ensureAuthenticated, async (req, res) => {
  try {
    // Encontra todas as tarefas associadas ao usuário autenticado
    const todos = await Todo.find({ userId: req.user._id });
    // Retorna as tarefas encontradas
    res.send(todos);
  } catch (error) {
    // Retorna um erro se houver um problema ao buscar as tarefas
    res.status(500).send({ error: 'Error fetching todos' });
  }
});

// Rota para criar uma nova tarefa
router.post('/todos', ensureAuthenticated, async (req, res) => {
  try {
    const { text, category } = req.body;
    // Cria uma nova tarefa com os dados fornecidos e o ID do usuário autenticado
    const todo = new Todo({
      text,
      category,
      userId: req.user._id
    });
    // Salva a nova tarefa no banco de dados
    await todo.save();
    // Retorna a tarefa criada com o status 201 (Criado)
    res.status(201).json(todo);
  } catch (error) {
    // Retorna um erro se houver um problema ao criar a tarefa
    res.status(500).json({ error: 'Error creating todo' });
  }
});

// Rota para atualizar uma tarefa existente
router.put('/todos/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { isCompleted } = req.body;
    // Encontra e atualiza a tarefa com o ID fornecido e associada ao usuário autenticado
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isCompleted },
      { new: true }
    );
    if (!todo) {
      // Retorna um erro se a tarefa não for encontrada
      return res.status(404).send({ error: 'Todo not found' });
    }
    // Retorna a tarefa atualizada
    res.send(todo);
  } catch (error) {
    // Retorna um erro se houver um problema ao atualizar a tarefa
    res.status(500).send({ error: 'Error updating todo' });
  }
});

// Rota para remover uma tarefa existente
router.delete('/todos/:id', ensureAuthenticated, async (req, res) => {
  try {
    // Encontra e remove a tarefa com o ID fornecido e associada ao usuário autenticado
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      // Retorna um erro se a tarefa não for encontrada
      return res.status(404).send({ error: 'Todo not found' });
    }
    // Retorna sucesso na remoção da tarefa
    res.send({ success: true });
  } catch (error) {
    // Retorna um erro se houver um problema ao remover a tarefa
    res.status(500).send({ error: 'Error deleting todo' });
  }
});

// Exporta o roteador para ser usado em outros arquivos
module.exports = router;
