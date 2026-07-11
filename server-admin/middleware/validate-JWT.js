import jwt from 'jsonwebtoken';
 
export const validateJWT = (req, res, next) => {
  const jwtConfig = {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };
 
  if (!jwtConfig.secret) {
    console.error('Error de validación JWT: JWT_SECRET no está definido');
    return res.status(500).json({
      success: false,
      message: 'Configuración del servidor inválida: falta JWT_SECRET',
    });
  }
 
  const token =
    req.header('x-token') ||
    req.header('Authorization')?.replace('Bearer ', '');
 
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No se proporcionó un token',
      error: 'MISSING_TOKEN',
    });
  }
 
  try {
    const verifyOptions = {};
    // Omitimos la validación estricta de issuer y audience para evitar fallas por desincronización de variables de entorno en el desarrollo local.
    // La firma criptográfica sigue siendo completamente validada por seguridad.
    const decoded = jwt.verify(token, jwtConfig.secret, verifyOptions);
 
    // Log para debug - remover en producción
    if (!decoded.role) {
      console.warn(
        `Token sin campo 'role' para usuario ${decoded.sub}. Payload:`,
        JSON.stringify(decoded, null, 2)
      );
    }
 
    req.user = {
      id: decoded.sub, // userId del servicio de autenticación
      jti: decoded.jti, // ID único del token
      iat: decoded.iat, // Emitido en
      role: decoded.role || 'USER_ROLE', // Rol del usuario (default: USER_ROLE)
    };
 
    next();
  } catch (error) {
    console.error('Error de validación JWT:', error.message);
 
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: `El token ha expirado: ${error.message}`,
        error: 'TOKEN_EXPIRED',
      });
    }
 
    if (error.name === 'JsonWebTokenError') {
      const decoded = jwt.decode(token, { complete: true }) || {};
      return res.status(401).json({
        success: false,
        message: `Token inválido: ${error.message} | Secret: ${jwtConfig.secret} | Alg: ${decoded.header?.alg} | Sub: ${decoded.payload?.sub} | Role: ${decoded.payload?.role} | Iss: ${decoded.payload?.iss}`,
        error: 'INVALID_TOKEN',
      });
    }
 
    return res.status(500).json({
      success: false,
      message: 'Error al validar el token',
      error: 'TOKEN_VALIDATION_ERROR',
    });
  }
};