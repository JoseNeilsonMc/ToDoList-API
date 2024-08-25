# API de Gerenciamento de Tarefas

Esta API, desenvolvida com Node.js, Express e Mongoose, permite autenticação de usuários e gerenciamento de tarefas.

## Tecnologias

- **Node.js** e **Express**: Backend e gerenciamento de rotas.
- **Mongoose**: ODM para MongoDB.
- **Passport**: Autenticação.
- **dotenv**: Variáveis de ambiente.
- **cors**: Permissões CORS.
- **MongoMemoryServer**: Banco de dados em memória para testes.

## Funcionalidades

- **Autenticação com Google**: Login com conta Google.
- **Login/Registro com Email e Senha**: Criação e login de conta via email e senha.
- **Gerenciamento de Tarefas**: CRUD de tarefas do usuário autenticado.

## Configuração

1. Clone o repositório:
    ```bash
    git clone https://github.com/usuario/repositorio.git
    cd repositorio
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz com:
    ```env
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    PORT=5000
    ```

4. Inicie o servidor:
    ```bash
    npm start
    ```
