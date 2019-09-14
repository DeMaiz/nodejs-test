module.exports = {
    info: {
        title: 'mikaelslab-nodejs',
        version: '1.0.0',
        description: 'Mikaelslab-NodeJS',
    },
    host: 'http://localhost:3000',
    basePath: '/',
    openapi: '3.0.0',
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};