import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { env } from './config/config';
import { initializeRedis } from './shared/redis/redis.service';
import { errorHandler } from './shared/middlewares/error-handler';
import routes from './routes/routes';

class Server {
    protected app: express.Application;

    constructor() {
        this.app = express();
    }

    async config() {
        await initializeRedis();

        this.app.set('port', env.PORT);
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());

        this.app.use('/api', routes);

        this.app.use(errorHandler);
        this.app.use((_req, res) => {
            res.status(404).json({ status: 'error', error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' } });
        });
    }

    async start() {
        await this.config();
        this.app.listen(this.app.get('port'), () => {
            // eslint-disable-next-line no-console
            console.log(`Vademecum MS running on port ${this.app.get('port')}`);
        });
    }
}

const server = new Server();

server.start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
});
