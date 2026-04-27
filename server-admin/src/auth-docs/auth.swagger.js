/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario (Servicio C#)
 *     tags: [Authentication]
 *     servers: 
 *       - url: http://localhost:5227
 *         description: Microservicio de Autenticación (.NET). Requiere formato form-data para permitir la subida de la imagen de perfil.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rigo"
 *               surname:
 *                 type: string
 *                 example: "Godinez"
 *               username:
 *                 type: string
 *                 example: "rgodinez"
 *               email:
 *                 type: string
 *                 example: "rigo.fajardo67@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               phone:
 *                 type: string
 *                 example: "46537862"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario (JPEG/PNG)
 *     responses:
 *       200:
 *         description: Registro exitoso. Se envía un correo con el token de verificación.
 *       400:
 *         description: Datos inválidos (campos vacíos o mal formato)
 *       422:
 *         description: La contraseña no cumple con la longitud mínima requerida
 *       409:
 *         description: El usuario o correo ya existe
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verificar correo electrónico (Servicio C#)
 *     tags: [Authentication]
 *     servers:
 *       - url: http://localhost:5227
 *         description: Valida la cuenta usando el token enviado por correo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "TZ0yRcfWq0gwoBP9Qfxq4nlUDDtTVP88AkA9W09rivI"
 *     responses:
 *       200:
 *         description: Correo verificado con éxito
 *       400:
 *         description: Token vacío o no enviado
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Token no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión (Servicio C#)
 *     tags: [Authentication]
 *     servers:
 *       - url: http://localhost:5227
 *         description: Devuelve el JWT para acceder a los servicios.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EmailOrUsername:
 *                 type: string
 *                 example: "rigo.fajardo67@gmail.com"
 *               Password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Campos vacíos o mal enviados
 *       401:
 *         description: Credenciales incorrectas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */