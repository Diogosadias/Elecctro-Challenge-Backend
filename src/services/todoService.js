import knex from '../config/database.js';  

class TodoService {
    constructor() {
        this.todos = [];
    }

    /**
     * Lista todos os items com filtros e ordenação
     * @async
     * @param {string} filter - Filtro de estado ('ALL', 'COMPLETE', 'INCOMPLETE')
     * @param {string} orderBy - Campo para ordenação ('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT')
     * @returns {Promise<Array<Todo>>} Lista de Todos filtrada e ordenada
     */
    async list(filter, orderBy) {
        try {
            let query = knex('todos');

            // Aplica filtro
            if (filter !== 'ALL') {
                const state = filter === 'COMPLETE' ? 'COMPLETE' : 'INCOMPLETE';
                query = query.where('state', state);
            }

            // Aplica ordenação
            switch (orderBy) {
                case 'DESCRIPTION':
                    query = query.orderBy('description', 'asc');
                    break;
                case 'COMPLETED_AT':
                    query = query.orderBy('completed_at', 'desc', 'nulls_last');
                    break;
                case 'CREATED_AT':
                default:
                    query = query.orderBy('created_at', 'desc');
            }

            return await query;
        } catch (error) {
            throw new Error(`Erro ao listar todos: ${error.message}`);
        }
    }

    /**
     * Cria um novo Todo
     * @async
     * @param {Todo} todo - Instância de Todo para ser criada
     * @returns {Promise<Todo>} Todo criado
     */
    async create(todo) {
        try {
            const [created] = await knex('todos')
                .insert({
                    id: todo.id,
                    state: todo.state,
                    description: todo.description,
                    created_at: todo.createdAt,
                    completed_at: todo.completedAt
                })
                .returning('*');

            return created;
        } catch (error) {
            throw new Error(`Erro ao criar todo: ${error.message}`);
        }
    }

    /**
     * Busca um Todo pelo ID
     * @async
     * @param {string} id - ID do Todo
     * @returns {Promise<Todo|null>} Todo encontrado ou null
     */
    async getById(id) {
        try {
            const todo = await knex('todos')
                .where({ id })
                .first();
            
            return todo || null;
        } catch (error) {
            throw new Error(`Erro ao buscar todo: ${error.message}`);
        }
    }

    /**
     * Atualiza um Todo existente
     * @async
     * @param {string} id - ID do Todo
     * @param {Object} updates - Campos a serem atualizados
     * @returns {Promise<Todo>} Todo atualizado
     */
    async update(id, updates) {
        try {
            const [updated] = await knex('todos')
                .where({ id })
                .update(updates)
                .returning('*');

            return updated;
        } catch (error) {
            throw new Error(`Erro ao atualizar todo: ${error.message}`);
        }
    }

    /**
     * Remove um Todo
     * @async
     * @param {string} id - ID do Todo
     * @returns {Promise<void>}
     */
    async delete(id) {
        try {
            await knex('todos')
                .where({ id })
                .delete();
        } catch (error) {
            throw new Error(`Erro ao deletar todo: ${error.message}`);
        }
    }
}

export default new TodoService(); 