import Todo from '../models/Todo.js';
import todoService from '../services/todoService.js';

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
export const createTodo = async (request, h) => {
    //retirar descrição do payload
    const { description } = request.payload;

    const newTodo = new Todo(description);

    await todoService.create(newTodo);

    return h.response(newTodo).code(201); 
};

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
export const listTodos = async (request, h) => {
    const { filter, orderBy } = request.query;
    const todos = await todoService.list(filter, orderBy);
    return h.response(todos).code(200);
};

