import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Restaurante ICE API',
            version: '1.0.0',
            description: 'Documentación oficial de los servicios del Restaurante ICE. Incluye gestión de usuarios (Auth), productos, pedidos, reservaciones y eventos.',
            contact: {
                name: 'Ice Team'
            }
        },
        servers: [
            {
                url: 'http://localhost:3021/RestauranteICE/v1',
                description: 'Servidor Local de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    // Rutas de los archivos donde Swagger buscará los comentarios @swagger
    // Dentro de swaggerOptions en documentation.js
apis: [
    `${process.cwd()}/src/auth-docs/*.js`,
    `${process.cwd()}/src/analytics/*.js`,
    `${process.cwd()}/src/category/*.js`,
    `${process.cwd()}/src/event/*.js`,
    `${process.cwd()}/src/order/*.js`,
    `${process.cwd()}/src/product/*.js`,
    `${process.cwd()}/src/reservations/*.js`,
    `${process.cwd()}/src/restaurant/*.js`,
    `${process.cwd()}/src/table/*.js`
]
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
export { swaggerUi };