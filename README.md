Lista de tarefas com login de usuario e senha

- Primeiramente baixe o repo;
- É necessario ter o sql server instalado e criar as tabelas de users com o comando CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL
);
  e tambem a tabela tasks com o comando CREATE TABLE tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    completed BIT DEFAULT 0,
    userId INT NOT NULL,
    CONSTRAINT FK_User FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
- Acesse a pasta de frontend dando cd frontend;
- De um npm i  e quando acabar rode npm run start
- Acesse a pasta de backend dando cd backend
- De um npm i e quando acabar rode npm run start:dev
- Voce abrira a aplicaçao na tela de login. Nessa tela havera um botao de novo cadastro. É necessario cadastrar usuario e senha para fazer o login.
- Assim que logar vai ter acesso a aplicação e podera criar tarefas, editar, deletar.
- Existem testes para fazer, caso queira rode npm run test dentro da pasta de frontend ou backend.
  
  
