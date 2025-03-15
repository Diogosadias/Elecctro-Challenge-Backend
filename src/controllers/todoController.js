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
            const created = await todoService.create(newTodo);
            return h.response(created).code(201);  // Retornar o todo criado do banco
        } catch (error) {
            return h.response({
                statusCode: 500,
                error: "Internal Server Error",
                message: error.message
            }).code(500);
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
            return h.response({
                statusCode: 500,
                error: "Internal Server Error",
                message: error.message
            }).code(500);
        }
    },

/**
 * Edit a todo item
 * @async
 * @param {Object} request - The Hapi request object
 * @param {Object} request.params - URL parameters
 * @param {string} request.params.id - Todo ID to be updated
 * @param {Object} request.payload - Request body
 * @param {string} [request.payload.state] - New state (COMPLETE or INCOMPLETE)
 * @param {string} [request.payload.description] - New description
 * @param {Object} h - The Hapi response toolkit
 * @returns {Promise<Object>} Updated todo item
 */
    updateTodo: async (request, h) => {
        try {
            const { id } = request.params;
            const updateData = request.payload;
            
            // Verificar se o todo existe
            const existingTodo = await todoService.getById(id);
            if (!existingTodo) {
                return h.response({
                    statusCode: 404,
                    error: "Not Found",
                    message: "Todo not found"
                }).code(404);
            }

            // Verificar se está tentando modificar a descrição de um todo completo
            if (updateData.description && existingTodo.state === 'COMPLETE') {
                return h.response({
                    statusCode: 400,
                    error: "Bad Request",
                    message: "Cannot modify description of a completed todo"
                }).code(400);
            }

            const updatedTodo = await todoService.update(id, updateData);
            return h.response(updatedTodo).code(200);
        } catch (error) {
            return h.response({
                statusCode: 500,
                error: "Internal Server Error",
                message: error.message
            }).code(500);
        }
    },

/**
 * Remove an item from the to-do list
 * @async
 * @param {Object} request - The Hapi request object
 * @param {Object} request.params - URL parameters
 * @param {string} request.params.id - Todo ID to be deleted
 * @param {Object} h - The Hapi response toolkit
 * @returns {Promise<Object>} Empty response with 204 status on success, 404 if not found
 */
    deleteTodoHandler: async (request, h) => {
        try {
            const { id } = request.params;
            const exists = await todoService.getById(id);
            
            if (!exists) {
                return h.response({
                    statusCode: 404,
                    error: "Not Found",
                    message: "Todo not found"
                }).code(404);
            }

            const deleted = await todoService.delete(id);
            
            if (deleted.isError) {
                return h.response({
                    statusCode: deleted.statusCode,
                    error: "Bad Request",
                    message: deleted.message
                }).code(deleted.statusCode);
            }

            return h.response().code(204);
        } catch (error) {
            return h.response({
                statusCode: 500,
                error: "Internal Server Error",
                message: error.message
            }).code(500);
        }
    }
};

export default todoController;
