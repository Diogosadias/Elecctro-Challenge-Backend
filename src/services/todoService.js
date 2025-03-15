import db from '../config/database.js';  
import { validateUUID, validateTodoState } from '../utils/validators.js';
import { TODO_STATES } from '../utils/constants.js';
import { SORT_FIELDS } from '../utils/constants.js';

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
            let query = db('todos');
            
            if (filter !== 'ALL') {
                query = query.where('state', filter);
            }

            const results = await this.applyOrdering(query, orderBy);
            return results;
        } catch (error) {
            throw new AppError(`Erro ao listar todos: ${error.message}`);
        }
    }

     async applyOrdering(query, orderBy) {
        switch (orderBy) {
            case SORT_FIELDS.DESCRIPTION:
                return query.orderBy('description', 'asc');
            case SORT_FIELDS.COMPLETED_AT:
                return query.orderByRaw('completed_at DESC NULLS LAST');
            case SORT_FIELDS.CREATED_AT:
            default:
                return query.orderBy('created_at', 'desc');
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
            const [created] = await db('todos')
                .insert({
                    id: todo.id,
                    state: 'INCOMPLETE',
                    description: todo.description,
                    created_at: new Date(),
                    completed_at: null
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
            if (!validateUUID(id)) {
                throw new Error('ID inválido: deve ser um UUID válido');
            }

            const todo = await db('todos')
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
     * @returns {Promise<Todo|null|Object>} Todo atualizado, null se não encontrado, ou objeto de erro
     * @throws {Error} Se houver erro na atualização ou validação
     */
    async update(id, updates) {
        try {
            const todo = await this.getById(id);
            
            if (!todo) {
                return null;
            }

            // Preparar dados para atualização
            const updateData = {
                ...updates,
                // Atualizar completedAt apenas se o estado estiver mudando para COMPLETE
                completed_at: updates.state === 'COMPLETE' ? new Date() : 
                            updates.state === 'INCOMPLETE' ? null : 
                            todo.completed_at
            };

            const [updated] = await db('todos')
                .where({ id })
                .update(updateData)
                .returning(['id', 'state', 'description', 'created_at', 'completed_at']);

            return {
                id: updated.id,
                state: updated.state,
                description: updated.description,
                createdAt: updated.created_at,
                completedAt: updated.completed_at
            };
        } catch (error) {
            throw new Error(`Error updating todo: ${error.message}`);
        }
    }

    /**
     * Remove um Todo
     * @async
     * @param {string} id - ID do Todo
     * @returns {Promise<boolean>} true se deletado, false se não encontrado
     */
    async delete(id) {
        try {
            if (!validateUUID(id)) {
                return {
                    isError: true,
                    statusCode: 400,
                    message: 'ID inválido: deve ser um UUID válido'
                };
            }

            const deleted = await db('todos')
                .where({ id })
                .delete()
                .returning('*');
            
            return deleted.length > 0;
        } catch (error) {
            throw new Error(`Erro ao deletar todo: ${error.message}`);
        }
    }
}

export default new TodoService(); 