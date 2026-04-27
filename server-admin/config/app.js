'use strict'

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { dbConnection } from './db.js';
import { corsOptions } from './cors.configuration.js'
import { helmetOptions } from './helmet.configuration.js'
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middleware/handle-errors.js';

// IMPORTANTE: Cambiamos YAML por tus nuevos archivos de configuración
import { swaggerDocs, swaggerUi } from './documentation.js';

import analyticsRoutes from '../src/analytics/analytics.routes.js'; 
import categoryRoutes from '../src/Category/category.routes.js';
import productRoutes from '../src/product/product.routes.js';
import restaurantRoutes from '../src/restaurant/restaurant.routes.js'; 
import tableRoutes from '../src/table/table.routes.js'; 
import orderRoutes from '../src/order/order.routes.js'; 
import eventRoutes from '../src/event/eventRoutes.js';
import reservationsRoutes from '../src/reservations/reservation.routes.js';

const BASE_PATH = '/RestauranteICE/v1';

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);    
}

const routes = (app) =>{
    // Servir la documentación usando swagger-jsdoc (el que lee los comentarios)
    app.use(`${BASE_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    
    app.use(`${BASE_PATH}/analytics`, analyticsRoutes); 
    app.use(`${BASE_PATH}/product`, productRoutes);
    app.use(`${BASE_PATH}/category`, categoryRoutes);
    app.use(`${BASE_PATH}/restaurant`, restaurantRoutes);
    app.use(`${BASE_PATH}/table`, tableRoutes); 
    app.use(`${BASE_PATH}/order`, orderRoutes); 
    app.use(`${BASE_PATH}/event`, eventRoutes);
    app.use(`${BASE_PATH}/reservation`, reservationsRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) =>{
        res.status(200).json({
            status: 'healthy',
            service: 'Restaurante ICE Server'
        })
    })

    app.use((req, res) =>{
        res.status(404).json({
            success: false,
            message: 'Ruta No Existe en Este Servidor'
        })
    });
}

export const initServer = async () =>{
    const app = express();
    const PORT = process.env.PORT || 3021; 
    app.set('trust proxy', 1);

    try{
        await dbConnection();
        middlewares(app);
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Restaurante_ICE server running on port ${PORT}`);
            console.log(`Documentation: http://localhost:${PORT}${BASE_PATH}/api-docs`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`)
        });
    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};