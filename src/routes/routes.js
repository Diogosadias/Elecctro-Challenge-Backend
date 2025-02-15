//Dependencias
import Joi from '@hapi/joi';
//Controllers
import {createTodo,listTodos} from '../controllers/todoController.js';

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
                })
            }
        },
        handler: createTodo
    },{
        method: 'GET',
        path: '/todos',
        options: {
            tags: ['api', 'todos'],
            description: 'Listar tarefas com filtros e ordenação',
            notes: 'Retorna uma lista de tarefas filtradas e ordenadas conforme os parâmetros fornecidos',
            validate: {
                query: Joi.object({
                    filter: Joi.string().valid('ALL', 'COMPLETE', 'INCOMPLETE').default('ALL'),
                    orderBy: Joi.string().valid('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT').default('CREATED_AT')
                })
            }
        },
        handler: listTodos
    }
];

export default routes;
