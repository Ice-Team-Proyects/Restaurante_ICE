import jwt from 'jsonwebtoken';
import http from 'http';

const JWT_SECRET = "ThisIsSecretKeyForRestaurant1234";
const JWT_ISSUER = "AuthService";
const JWT_AUDIENCE = "AuthServiceUsers";

// Generar token
const token = jwt.sign(
    { sub: "6a2b00000000000000000001", role: "ADMIN_ROLE" },
    JWT_SECRET,
    { issuer: JWT_ISSUER, audience: JWT_AUDIENCE, expiresIn: '1h' }
);

const PORT = 3021;
const BASE_PATH = '/RestauranteICE/v1';

// Función helper para realizar peticiones HTTP
function request(method, path, body = null, isMultipart = false, customHeaders = {}) {
    return new Promise((resolve, reject) => {
        const headers = {
            'Authorization': `Bearer ${token}`,
            ...customHeaders
        };
        
        let reqBody = null;
        if (body) {
            if (isMultipart) {
                // Implementación manual básica de multipart para tests
                const boundary = '----TestBoundary';
                headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
                
                let parts = [];
                for (const [key, value] of Object.entries(body)) {
                    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`);
                }
                parts.push(`--${boundary}--\r\n`);
                reqBody = Buffer.concat(parts.map(p => Buffer.from(p)));
                headers['Content-Length'] = reqBody.length;
            } else {
                headers['Content-Type'] = 'application/json';
                reqBody = JSON.stringify(body);
                headers['Content-Length'] = Buffer.byteLength(reqBody);
            }
        }

        const options = {
            hostname: 'localhost',
            port: PORT,
            path: `${BASE_PATH}${path}`,
            method: method,
            headers: headers
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch {
                    resolve({ status: res.statusCode, rawBody: data });
                }
            });
        });

        req.on('error', (err) => reject(err));
        if (reqBody) {
            req.write(reqBody);
        }
        req.end();
    });
}

async function runTests() {
    console.log("=== INICIANDO PRUEBAS DE INTEGRACIÓN ===");
    let categoryId = null;
    let productId = null;
    let tableId = null;
    let orderId = null;
    let eventId = null;
    let promotionId = null;
    let inscriptionId = null;

    try {
        // 1. CATEGORÍAS
        console.log("\n1. Probando Categorías...");
        const createCatRes = await request('POST', '/category', {
            categoryName: "Platillos Test",
            type: "Platillos",
            description: "Categoría de prueba de integración"
        });
        console.log(`Crear Categoría: ${createCatRes.status} - ${createCatRes.body?.message}`);
        if (createCatRes.status !== 201) throw new Error("Fallo al crear categoría");
        categoryId = createCatRes.body.data?._id || createCatRes.body.data?.id;

        const getCatsRes = await request('GET', '/category');
        console.log(`Listar Categorías: ${getCatsRes.status} (Total: ${getCatsRes.body.data?.length})`);

        // 2. PRODUCTOS
        console.log("\n2. Probando Productos...");
        const createProdRes = await request('POST', '/product', {
            saucer: "Tacos Test",
            description: "Deliciosos tacos de prueba",
            price: "15.00",
            category: categoryId
        }, true);
        console.log(`Crear Producto: ${createProdRes.status} - ${createProdRes.body?.message}`);
        if (createProdRes.status !== 201) throw new Error("Fallo al crear producto");
        productId = createProdRes.body.data?._id || createProdRes.body.data?.id;

        const getProdsRes = await request('GET', '/product');
        console.log(`Listar Productos: ${getProdsRes.status} (Total: ${getProdsRes.body.data?.length})`);

        const updateProdRes = await request('PUT', `/product/${productId}`, {
            saucer: "Tacos Test Actualizados",
            price: "18.50"
        }, true);
        console.log(`Actualizar Producto: ${updateProdRes.status} - ${updateProdRes.body?.message}`);

        const randomTableNumber = Math.floor(Math.random() * 9000) + 1000;
        const createTableRes = await request('POST', '/table', {
            number: randomTableNumber,
            capacity: 4,
            status: "disponible"
        });
        console.log(`Crear Mesa (#${randomTableNumber}): ${createTableRes.status} - ${createTableRes.body?.message}`);
        if (createTableRes.status !== 201) {
            console.error("Detalle del error:", createTableRes.body);
            throw new Error("Fallo al crear mesa");
        }
        tableId = createTableRes.body.data?._id || createTableRes.body.data?.id;

        const getTablesRes = await request('GET', '/table');
        console.log(`Listar Mesas: ${getTablesRes.status} (Total: ${getTablesRes.body.data?.length})`);

        const updateTableRes = await request('PUT', `/table/${tableId}`, {
            capacity: 6,
            status: "ocupada"
        });
        console.log(`Actualizar Mesa: ${updateTableRes.status} - ${updateTableRes.body?.message}`);

        // 4. PEDIDOS
        console.log("\n4. Probando Pedidos (Ordenes)...");
        const createOrderRes = await request('POST', '/order', {
            tableId: tableId,
            items: [{ productId: productId, quantity: 2, price: 18.50 }],
            totalAmount: 37.00,
            status: "PENDING"
        });
        console.log(`Crear Pedido: ${createOrderRes.status} - ${createOrderRes.body?.message}`);
        if (createOrderRes.status !== 201) throw new Error("Fallo al crear pedido");
        orderId = createOrderRes.body.data?._id || createOrderRes.body.data?.id;

        const getOrdersRes = await request('GET', '/order');
        console.log(`Listar Pedidos: ${getOrdersRes.status} (Total: ${getOrdersRes.body.data?.length})`);

        const updateOrderRes = await request('PUT', `/order/${orderId}`, {
            status: "PREPARING"
        });
        console.log(`Actualizar Estado de Pedido: ${updateOrderRes.status} - ${updateOrderRes.body?.message}`);

        // 5. EVENTOS, PROMOCIONES E INSCRIPCIONES
        console.log("\n5. Probando Eventos y Experiencias...");
        const createEventRes = await request('POST', '/event/events', {
            name_event: "Noche Gastronómica Test",
            description: "Cena especial para probar APIs",
            date_event: "2026-07-20T20:00:00.000Z",
            capacity: 20,
            location: "Sucursal Central",
            price: 50.00
        });
        console.log(`Crear Evento: ${createEventRes.status} - ${createEventRes.body?.message}`);
        if (createEventRes.status !== 201) throw new Error("Fallo al crear evento");
        eventId = createEventRes.body.data?._id || createEventRes.body.data?.id;

        const getEventsRes = await request('GET', '/event/events');
        console.log(`Listar Eventos: ${getEventsRes.status} (Total: ${getEventsRes.body.data?.length})`);

        const createPromoRes = await request('POST', '/event/promotions', {
            name_promotion: "Descuento Test",
            description: "Descuento del 10%",
            discount_percentage: 10,
            date_start: "2026-06-01T00:00:00.000Z",
            date_end: "2026-08-01T23:59:59.000Z",
            min_people: 1
        });
        console.log(`Crear Promoción: ${createPromoRes.status} - ${createPromoRes.body?.message}`);
        if (createPromoRes.status !== 201) throw new Error("Fallo al crear promoción");
        promotionId = createPromoRes.body.data?._id || createPromoRes.body.data?.id;

        const createInscRes = await request('POST', '/event/inscriptions', {
            name_customer: "Juan Pérez Test",
            email_customer: "juan_test@email.com",
            phone_customer: "55512345",
            id_event: eventId,
            number_people: 2,
            id_promotion: promotionId
        });
        console.log(`Crear Inscripción a Evento: ${createInscRes.status} - ${createInscRes.body?.message}`);
        if (createInscRes.status !== 201) throw new Error("Fallo al inscribirse al evento");
        inscriptionId = createInscRes.body.data?._id || createInscRes.body.data?.id;

        const getInscsRes = await request('GET', '/event/inscriptions');
        console.log(`Listar Inscripciones: ${getInscsRes.status} (Total: ${getInscsRes.body.data?.length})`);

        // 6. ELIMINACIONES (Soft Delete / Delete)
        console.log("\n6. Probando Eliminaciones...");
        const delInscRes = await request('PATCH', `/event/inscriptions/delete/${inscriptionId}`);
        console.log(`Eliminar Inscripción: ${delInscRes.status} - ${delInscRes.body?.message}`);

        const delOrderRes = await request('PATCH', `/order/delete/${orderId}`);
        console.log(`Eliminar Pedido: ${delOrderRes.status} - ${delOrderRes.body?.message}`);

        const delTableRes = await request('PATCH', `/table/delete/${tableId}`);
        console.log(`Eliminar Mesa: ${delTableRes.status} - ${delTableRes.body?.message}`);

        const delProdRes = await request('PATCH', `/product/delete/${productId}`);
        console.log(`Eliminar Producto: ${delProdRes.status} - ${delProdRes.body?.message}`);

        const delCatRes = await request('PATCH', `/category/delete/${categoryId}`);
        console.log(`Eliminar Categoría: ${delCatRes.status} - ${delCatRes.body?.message}`);

        console.log("\n=== ¡TODAS LAS PRUEBAS DE INTEGRACIÓN SE COMPLETARON CON ÉXITO! ===");
        process.exit(0);
    } catch (err) {
        console.error("\n*** ERROR EN LAS PRUEBAS DE INTEGRACIÓN ***");
        console.error(err);
        process.exit(1);
    }
}

// Pequeño retardo para asegurar conexión
setTimeout(runTests, 500);
