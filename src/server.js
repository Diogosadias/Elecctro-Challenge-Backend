import Hapi from '@hapi/hapi';
import swagger from './docs/swagger.js';
import routes from './routes/routes.js';


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(swagger);

    server.route(routes);

     
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();