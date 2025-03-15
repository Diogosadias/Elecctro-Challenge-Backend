import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

const swaggerOptions = {
    info: {
        title: 'Elecctro-Challenge-Backend API',
        version: '1.0.0',
        description: `
            RESTful API for managing todo items. 
            This API allows you to create, read, update and delete todo items, 
            with support for filtering and sorting capabilities.
        `,
        contact: {
            name: 'API Support',
            email: 'diogodias1997@hotmail.com',
            url: 'https://github.com/Diogosadias/Elecctro-Challenge-Backend'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
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
        try {
            await server.register([
                Inert,
                Vision,
                {
                    plugin: HapiSwagger,
                    options: swaggerOptions
                }
            ]);
            console.log('Swagger documentation initialized');
        } catch (error) {
            console.error('Failed to initialize Swagger documentation:', error);
            throw error;
        }
    }
};

export default swagger;

