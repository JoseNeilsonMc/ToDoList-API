module.exports = {
  // Define o ambiente de teste como Node.js
  testEnvironment: 'node',
  
  // Especifica um arquivo para configurar o ambiente de teste após a configuração inicial
  setupFilesAfterEnv: ['./jest.setup.js'],
  
  // Define o tempo máximo de execução de um teste antes de ser considerado falho (em milissegundos)
  testTimeout: 10000,
};
