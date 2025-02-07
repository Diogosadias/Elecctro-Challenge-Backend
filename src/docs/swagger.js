import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

const swaggerOptions = {
    info: {
        title: 'Elecctro-Challenge-Backend',
        version: '1.0.0',
    },
    documentationPath: '/docs',
    grouping: 'tags',
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
