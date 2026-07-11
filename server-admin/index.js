import dotenv from 'dotenv';
import { initServer } from './config/app.js';

const envConfig = dotenv.config();
if (envConfig.parsed && envConfig.parsed.JWT_SECRET) {
  process.env.JWT_SECRET = envConfig.parsed.JWT_SECRET;
}

initServer();