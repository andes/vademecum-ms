import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: parseInt(process.env.PORT || '4001', 10),
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),
    ALFABETA_ENDPOINT: process.env.ALFABETA_ENDPOINT || '',
    ALFABETA_USUARIO: process.env.ALFABETA_USUARIO || '',
    ALFABETA_CLAVE: process.env.ALFABETA_CLAVE || '',
    VADEMECUM_API_KEY: process.env.VADEMECUM_API_KEY || '',
};
