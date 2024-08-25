// Importa o MongoMemoryServer para criar uma instância de banco de dados MongoDB em memória para testes
const { MongoMemoryServer } = require('mongodb-memory-server');

// Importa o mongoose para manipular o banco de dados MongoDB
const mongoose = require('mongoose');

let mongoServer;

// Configuração antes dos testes serem executados
beforeAll(async () => {
  // Cria uma instância do MongoDB em memória
  mongoServer = await MongoMemoryServer.create();
  
  // Obtém a URI de conexão do MongoDB em memória
  const uri = mongoServer.getUri();
  
  // Conecta o mongoose ao banco de dados MongoDB em memória
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Configuração após todos os testes serem concluídos
afterAll(async () => {
  // Desconecta o mongoose do banco de dados
  await mongoose.disconnect();
  
  // Para o servidor MongoDB em memória
  await mongoServer.stop();
});

// Configuração após cada teste individual
afterEach(async () => {
  // Obtém as coleções do banco de dados MongoDB
  const collections = mongoose.connection.collections;
  
  // Itera sobre todas as coleções e remove todos os documentos
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
