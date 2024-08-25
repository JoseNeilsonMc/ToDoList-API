// Middleware para verificar se o usuário está autenticado
module.exports = (req, res, next) => {
  
  // Verifica se a requisição tem um usuário autenticado
  if (req.isAuthenticated()) {
    // Se o usuário estiver autenticado, chama o próximo middleware ou rota
    return next();
  }

  // Se o usuário não estiver autenticado, retorna um status 401 (não autorizado) com uma mensagem de erro
  res.status(401).send({ error: 'Unauthorized' });
};
