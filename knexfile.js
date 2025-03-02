import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'admin',
      password: 'secret',
      database: 'todos_db'
    },
    migrations: {
      directory: './migrations'  // Certifique-se de que este caminho está correto
    },
    seeds: {
      directory: './seeds'  // Opcional, mas útil para testar com dados iniciais
    }
  }
};
