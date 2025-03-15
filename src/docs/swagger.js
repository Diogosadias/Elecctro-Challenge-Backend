import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

const swaggerOptions = {
    info: {
        title: 'Elecctro-Challenge-Backend API',
        version: '1.0.0',
        description: 'API para gerenciamento de tarefas (todos)',
        contact: {
            name: 'API Support'
        }
    },
    documentationPath: '/docs',
    grouping: 'tags',
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    jsonPath: '/swagger.json',
    swaggerUIPath: '/swagger',
    basePath: '/',
    schemes: ['http']
};

const swagger = {
    name: 'swagger',
    version: '1.0.0',
    register: async (server) => {
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);
    }
};

export default swagger;

