import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'sua_senha',
    database: process.env.DB_NAME || 'nome_do_banco'
  },
  pool: {
    min: 2,
    max: 10
  }
});

export default db; 