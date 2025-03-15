// Dependencies
import Joi from 'joi';  
import todoController from '../controllers/todoController.js';
import { todoResponseSchema } from '../schemas/todoSchema.js';

const routes = [
    {
        method: 'POST',
        path: '/todos',
        options: {
            tags: ['api', 'todos'],
            description: 'Create a new todo item',
            notes: 'Creates a new todo item with the provided description. The server will generate a unique identifier, set the initial state as "INCOMPLETE" and record the creation timestamp.',
            validate: {
                payload: Joi.object({
                    description: Joi.string()
                        .min(3)
                        .max(255)
                        .required()
                        .description('Todo description')
                }),
                failAction: (request, h, err) => {
                    console.error('Validation error:', err.details);
                    return h.response({ 
                        error: 'Bad Request',
                        message: 'Invalid payload'
                    }).code(400).takeover();
                }
            },
            response: {
                schema: todoResponseSchema.label('Todo')
            }
        },
        handler: todoController.createTodo
    },
    {
        method: 'GET',
        path: '/todos',
        options: {
            tags: ['api', 'todos'],
            description: 'List todos with filters and sorting',
            notes: 'Retrieves a list of todos based on filter and sorting criteria specified in query parameters.',
            validate: {
                query: Joi.object({
                    filter: Joi.string()
                        .valid('ALL', 'COMPLETE', 'INCOMPLETE')
                        .default('ALL')
                        .description('Filter todos by state'),
                    orderBy: Joi.string()
                        .valid('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT')
                        .default('CREATED_AT')
                        .description('Sort todos by field')
                })
            },
            response: {
                schema: Joi.array().items(todoResponseSchema).label('TodoList')
            }
        },
        handler: todoController.listTodos
    },
    {
        method: 'PATCH',
        path: '/todo/{id}',
        options: {
            tags: ['api', 'todos'],
            description: 'Edit a todo item',
            notes: `Updates an existing todo item. The item is referenced by id in the URL.
                   At least one of state or description must be provided.
                   Cannot modify description of completed todos.`,
            validate: {
                params: Joi.object({
                    id: Joi.string()
                        .guid({ version: ['uuidv4'] })
                        .required()
                        .description('Todo UUID')
                }).label('TodoIdParam'),
                payload: Joi.object({
                    state: Joi.string()
                        .valid('COMPLETE', 'INCOMPLETE')
                        .optional()
                        .description('Todo state'),
                    description: Joi.string()
                        .min(3)
                        .max(255)
                        .optional()
                        .description('Todo description')
                }).or('state', 'description')
                  .description('Update payload - at least one field must be provided')
                  .label('TodoUpdatePayload')
            },
            response: {
                schema: Joi.object({
                    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
                    state: Joi.string().valid('COMPLETE', 'INCOMPLETE').required(),
                    description: Joi.string().required(),
                    createdAt: Joi.date().iso().required(),
                    completedAt: Joi.date().iso().allow(null)
                }).label('TodoResponse').description('Updated todo item'),
                status: {
                    200: Joi.object({
                        id: Joi.string().guid({ version: ['uuidv4'] }).required(),
                        state: Joi.string().valid('COMPLETE', 'INCOMPLETE').required(),
                        description: Joi.string().required(),
                        createdAt: Joi.date().iso().required(),
                        completedAt: Joi.date().iso().allow(null)
                    }).label('TodoSuccessResponse'),
                    400: Joi.object({
                        statusCode: Joi.number().required(),
                        error: Joi.string().required(),
                        message: Joi.string().required()
                    }).label('TodoBadRequestError'),
                    404: Joi.object({
                        statusCode: Joi.number().required(),
                        error: Joi.string().required(),
                        message: Joi.string().required()
                    }).label('TodoNotFoundError'),
                    500: Joi.object({
                        statusCode: Joi.number().required(),
                        error: Joi.string().required(),
                        message: Joi.string().required()
                    }).label('TodoServerError')
                }
            }
        },
        handler: todoController.updateTodo
    },
    {
        method: 'DELETE',
        path: '/todo/{id}',
        options: {
            tags: ['api', 'todos'],
            description: 'Remove an item from the to-do list',
            notes: `This route removes an item from the to-do list. The item will be referenced by id using the URL parameter id.
                   The server verifies the referenced item exists. If the item does not exist it returns an HTTP 404 error.
                   This route returns an empty response with status 204 if it succeeds.`,
            validate: {
                params: Joi.object({
                    id: Joi.string()
                        .guid({ version: ['uuidv4'] })
                        .required()
                        .description('Todo UUID to be deleted')
                }),
                failAction: (request, h, err) => {
                    return h.response({
                        statusCode: 400,
                        error: "Bad Request",
                        message: err.details[0].message
                    }).code(400).takeover();
                }
            },
            response: {
                status: {
                    204: undefined, 
                    404: Joi.object({
                        statusCode: Joi.number().required(),
                        error: Joi.string().required(),
                        message: Joi.string().required()
                    }).description('Todo not found'),
                    500: Joi.object({
                        statusCode: Joi.number().required(),
                        error: Joi.string().required(),
                        message: Joi.string().required()
                    }).description('Internal server error')
                }
            }
        },
        handler: todoController.deleteTodoHandler
    }
];

export default routes;
