// Middleware para verificar se o usuário está autenticado
module.exports = (req, res, next) => {
  // Verifica se o usuário está autenticado via Passport
  if (req.isAuthenticated()) {
    // Se autenticado, prossiga para a próxima função/middleware
    return next();
  }

  // Se não autenticado, registre a tentativa de acesso não autorizado
  console.error(`[ERROR] Acesso não autorizado em: ${req.originalUrl}`);

  // Envia uma resposta padronizada com o status 401 e uma mensagem de erro
  res.status(401).json({
    success: false,
    message: 'Acesso não autorizado. Por favor, faça login para continuar.',
  });
};
