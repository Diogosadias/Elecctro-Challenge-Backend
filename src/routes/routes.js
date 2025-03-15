// Dependências
import Joi from 'joi';  
import todoController from '../controllers/todoController.js';

const routes = [
    {
        method: 'POST',
        path: '/todos',
        options: {
            tags: ['api', 'todos'],
            description: 'Criar uma nova tarefa',
            notes: 'Retorna uma mensagem de sucesso',
            validate: {
                payload: Joi.object({
                    description: Joi.string().min(3).max(255).required()
                }),
                failAction: (request, h, err) => {
                    console.error('Erro de validação:', err.details);
                    return h.response({ error: 'Payload inválido' }).code(400).takeover();
                }
            }
        },
        handler: todoController.createTodo 
    },
    {
        method: 'GET',
        path: '/todos',
        options: {
            tags: ['api', 'todos'],
            description: 'List Todos with Filters & Ordenation',
            notes: 'This route should list the to-do items considering the conditions imposed on the query parameters: filter & orderBy',
            validate: {
                query: Joi.object({
                    filter: Joi.string().valid('ALL', 'COMPLETE', 'INCOMPLETE').default('ALL'),
                    orderBy: Joi.string().valid('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT').default('CREATED_AT')
                })
            }
        },
        handler: todoController.listTodos  
    },
    {
        method: 'PATCH',
        path: '/todo/{id}',
        options: {
          tags: ['api', 'todos'],
          description: 'Editar uma tarefa existente',
          notes: 'Edita a descrição ou estado de uma tarefa existente.',
          validate: {
            params: Joi.object({
              id: Joi.string().required().description('ID da tarefa'),
            }),
            payload: Joi.object({
              state: Joi.string().valid('COMPLETE', 'INCOMPLETE').optional(),
              description: Joi.string().min(3).max(255).optional()
            }).or('state', 'description'), 
            failAction: (request, h, err) => {
              console.error('Erro de validação:', err.details);
              return h.response({ error: 'Payload inválido' }).code(400).takeover();
            }
          },
          handler: todoController.updateTodo
        }
      },
      {
        method: 'DELETE',
        path: '/todo/{id}',
        options: {
          tags: ['api', 'todos'],
          description: 'Remover uma tarefa',
          notes: 'Remove uma tarefa da lista.',
          validate: {
            params: Joi.object({
              id: Joi.string().required().description('ID da tarefa')
            })
          },
          handler: todoController.deleteTodoHandler
        }
      }
];

export default routes;
