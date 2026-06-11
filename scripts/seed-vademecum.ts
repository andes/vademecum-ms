import { initializeRedis, closeRedis } from '../src/shared/redis/redis.service';
import { AlfabetaClient } from '../src/integrations/alfabeta/alfabeta.client';
import { AlfabetaSync } from '../src/integrations/alfabeta/alfabeta.sync';
import { VademecumRepository } from '../src/modules/vademecum/vademecum.repository';
import { env } from '../src/config/config';

const main = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('=== Seed Vademécum ===');

    if (!env.ALFABETA_ENDPOINT || !env.ALFABETA_USUARIO || !env.ALFABETA_CLAVE) {
        // eslint-disable-next-line no-console
        console.error('Error: Faltan variables ALFABETA_ENDPOINT, ALFABETA_USUARIO y ALFABETA_CLAVE en .env');
        process.exit(1);
    }

    await initializeRedis();

    const client = new AlfabetaClient({
        endpoint: env.ALFABETA_ENDPOINT,
        usuario: env.ALFABETA_USUARIO,
        clave: env.ALFABETA_CLAVE,
    });
    const repository = new VademecumRepository();
    const sync = new AlfabetaSync(client, repository);

    const result = await sync.syncFull();

    // eslint-disable-next-line no-console
    console.log(`=== Seed completado: ${result.medications} medicamentos, ${result.drugs} drogas, ${result.actions} acciones, ultimolog=${result.ultimolog} ===`);

    await closeRedis();
};

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed falló:', err);
    process.exit(1);
});
