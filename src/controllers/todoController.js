import Todo from '../models/Todo.js';
import todoService from '../services/todoService.js';

export const todoController = {
/**
 * Controlador para criar um novo item Todo
 * @async
 * @param {Object} request - O objeto de requisição Hapi
 * @param {Object} request.payload - O payload da requisição
 * @param {string} request.payload.description - A descrição do Todo
 * @param {Object} h - O objeto de resposta Hapi
 * @returns {Promise<Object>} Retorna o objeto Todo criado com status 201
 * @throws {Error} Se houver erro na criação ou persistência do Todo
 */
    createTodo: async (request, h) => {
        try {
            const { description } = request.payload;
            const newTodo = new Todo(description);
            await todoService.create(newTodo);
            return h.response(newTodo).code(201); 
        } catch (error) {
            return h.response(error).code(500);
        }
    },

/**
 * Lista todos os items Todo com filtros e ordenação
 * @async
 * @param {Object} request - O objeto de requisição Hapi
 * @param {Object} request.query - Os parâmetros de query
 * @param {('ALL'|'COMPLETE'|'INCOMPLETE')} request.query.filter - Filtro de estado
 * @param {('DESCRIPTION'|'CREATED_AT'|'COMPLETED_AT')} request.query.orderBy - Campo para ordenação
 * @param {Object} h - O objeto de resposta Hapi
 * @returns {Promise<Object>} Lista de Todos filtrada e ordenada
 */
    listTodos: async (request, h) => {
        try {
            const { filter, orderBy } = request.query;
            const todos = await todoService.list(filter, orderBy);
            return h.response(todos).code(200);
        } catch (error) {
            return h.response(error).code(500);
        }
    },

/**
 * Controlador para atualizar um item Todo existente
 * @async
 * @param {Object} request - O objeto de requisição Hapi
 * @param {Object} request.params - Os parâmetros da URL
 * @param {string} request.params.id - O ID do Todo a ser atualizado
 * @param {Object} request.payload - O payload da requisição
 * @param {string} request.payload.description - A nova descrição do Todo
 * @param {boolean} request.payload.completed - O novo estado de conclusão
 * @param {Object} h - O objeto de resposta Hapi
 * @returns {Promise<Object>} Retorna o objeto Todo atualizado
 * @throws {Error} Se houver erro na atualização do Todo ou se não for encontrado
 */
    updateTodo: async (request, h) => {
        try {
            const { id } = request.params;
            const updateData = request.payload;
            const updatedTodo = await todoService.update(id, updateData);
            
            if (!updatedTodo) {
                return h.response({ message: 'Todo não encontrado' }).code(404);
            }
            
            return h.response(updatedTodo).code(200);
        } catch (error) {
            return h.response(error).code(500);
        }
    },

/**
 * Controlador para excluir um item Todo
 * @async
 * @param {Object} request - O objeto de requisição Hapi
 * @param {Object} request.params - Os parâmetros da URL
 * @param {string} request.params.id - O ID do Todo a ser excluído
 * @param {Object} h - O objeto de resposta Hapi
 * @returns {Promise<Object>} Retorna uma mensagem de sucesso
 * @throws {Error} Se houver erro na exclusão do Todo ou se não for encontrado
 */
    deleteTodoHandler: async (request, h) => {
        try {
            const { id } = request.params;
            const deleted = await todoService.delete(id);
            
            if (!deleted) {
                return h.response({ message: 'Todo não encontrado' }).code(404);
            }
            
            return h.response({ message: 'Todo removido com sucesso' }).code(200);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
};

export default todoController;
