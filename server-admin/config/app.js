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


// 1. IMPORTA TUS RUTAS AQUÍ:
import analyticsRoutes from '../src/analytics/analytics.routes.js'; // CORREGIDO AQUÍ

//import categoryRoutes from '../src/Category/category.routes.js';
//import productRoutes from '../src/product/product.routes.js';
import restaurantRoutes from '../src/restaurant/restaurant.routes.js'; 
import tableRoutes from '../src/table/table.routes.js'; // Del repo principal
import orderRoutes from '../src/order/order.routes.js'; // Tu aporte de Orders
import eventRoutes from '../src/event/eventRoutes.js';

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
    // 2. DILE AL SERVIDOR QUE USE TUS RUTAS AQUÍ:
    app.use(`${BASE_PATH}/analytics`, analyticsRoutes); // CORREGIDO AQUÍ

    //app.use(`${BASE_PATH}/product`, productRoutes);
    //app.use(`${BASE_PATH}/category`, categoryRoutes);
    app.use(`${BASE_PATH}/restaurant`, restaurantRoutes);
    app.use(`${BASE_PATH}/table`, tableRoutes); // Del repo principal
    app.use(`${BASE_PATH}/order`, orderRoutes); // Tu aporte de Orders
    app.use(`${BASE_PATH}/event`, eventRoutes);

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
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try{
        await dbConnection();
        middlewares(app);
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Restaurante_ICE server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`)
        });
    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};