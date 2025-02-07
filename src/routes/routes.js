//Dependencias
import Joi from '@hapi/joi';
//Controllers
//import { getTest } from '../controllers/testController.js';
import todoController from '../controllers/todoController.js';

const routes = [
    {
        method: 'GET',
        path: '/',
        options: {

            tags: ['api'],
            description: 'GET de teste',
            notes: 'Retorna uma mensagem de sucesso'
        },
        handler: () => ({ message: 'API funcionando!' })
    },
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
        handler: todoController.createTodo
    },
];

export default routes;
