import { getRedisClient } from '../../shared/redis/redis.service';

import { VademecumEntry, Drug, Action, VademecumMeta, VademecumStats } from './vademecum.types';

const PREFIX_MED = 'vademecum:med:';
const PREFIX_DROGA = 'vademecum:drogas:';
const PREFIX_ACCION = 'vademecum:acciones:';
const KEY_AUTOCOMPLETE = 'vademecum:autocomplete';
const KEY_META = 'vademecum:meta';

const parseMedId = (member: string): number | null => {
    const pipeIdx = member.lastIndexOf('|');
    if (pipeIdx === -1) {return null;}
    return parseInt(member.slice(pipeIdx + 1), 10) || null;
};

export class VademecumRepository {

    async searchByName(term: string, limit = 20): Promise<VademecumEntry[]> {
        const redis = getRedisClient();
        const normalized = term.toLowerCase();
        const min = `[${normalized}`;
        const max = `[${normalized}\xff`;

        const members = await redis.zrangebylex(KEY_AUTOCOMPLETE, min, max, 'LIMIT', 0, limit);
        if (members.length === 0) {return [];}

        const ids = members
            .map(parseMedId)
            .filter((id): id is number => id !== null);

        return this.getMedicationsByIds(ids);
    }

    async getMedicationById(id: number): Promise<VademecumEntry | null> {
        const redis = getRedisClient();
        const data = await redis.hgetall(`${PREFIX_MED}${id}`);
        if (!data || Object.keys(data).length === 0) {return null;}
        return this.mapHashToEntry(id, data);
    }

    async getMedicationBySnomed(snomed: string): Promise<VademecumEntry | null> {
        const redis = getRedisClient();
        const idStr = await redis.get(`vademecum:snomed:${snomed}`);
        if (!idStr) {return null;}
        return this.getMedicationById(parseInt(idStr, 10));
    }

    async getDrugs(term?: string, limit = 20): Promise<Drug[]> {
        const redis = getRedisClient();
        const keys = await redis.keys(`${PREFIX_DROGA}*`);
        const results: Drug[] = [];

        for (const key of keys) {
            const data = await redis.hgetall(key);
            if (data && data.id) {
                const drug: Drug = { id: parseInt(data.id, 10), descripcion: data.descripcion || '' };
                if (!term || drug.descripcion.toLowerCase().includes(term.toLowerCase())) {
                    results.push(drug);
                }
            }
        }

        results.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        return results.slice(0, limit);
    }

    async getActions(term?: string, limit = 20): Promise<Action[]> {
        const redis = getRedisClient();
        const keys = await redis.keys(`${PREFIX_ACCION}*`);
        const results: Action[] = [];

        for (const key of keys) {
            const data = await redis.hgetall(key);
            if (data && data.id) {
                const action: Action = { id: parseInt(data.id, 10), descripcion: data.descripcion || '' };
                if (!term || action.descripcion.toLowerCase().includes(term.toLowerCase())) {
                    results.push(action);
                }
            }
        }

        results.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        return results.slice(0, limit);
    }

    async getStats(): Promise<VademecumStats> {
        const redis = getRedisClient();
        const meta = await redis.hgetall(KEY_META);

        return {
            ultimolog: meta?.ultimolog || null,
            cant_med: parseInt(meta?.cant_med || '0', 10),
            cant_drogas: parseInt(meta?.cant_drogas || '0', 10),
            cant_acciones: parseInt(meta?.cant_acciones || '0', 10),
            fecha_act: meta?.fecha_act || null,
        };
    }

    async getMedicationsByIds(ids: number[]): Promise<VademecumEntry[]> {
        if (ids.length === 0) {return [];}
        const redis = getRedisClient();
        const pipeline = redis.pipeline();

        for (const id of ids) {
            pipeline.hgetall(`${PREFIX_MED}${id}`);
        }

        const results = await pipeline.exec();
        if (!results) {return [];}

        const entries: VademecumEntry[] = [];
        for (let i = 0; i < results.length; i++) {
            const [, data] = results[i] as [Error | null, Record<string, string> | null];
            if (data && Object.keys(data).length > 0) {
                entries.push(this.mapHashToEntry(ids[i], data));
            }
        }
        return entries;
    }

    private mapHashToEntry(id: number, data: Record<string, string>): VademecumEntry {
        return {
            id,
            estado: data.estado || '',
            nombre: data.nombre || '',
            presentacion: data.presentacion || '',
            importado: data.importado || '',
            heladera: data.heladera || '',
            troquel: data.troquel || '',
            codigoDeBarras: this.parseArray(data.codigoDeBarras),
            atcs: this.parseArray(data.atcs),
            iva: data.iva || '',
            laboratorio: parseInt(data.laboratorio || '0', 10),
            tipoDeVenta: parseInt(data.tipoDeVenta || '0', 10),
            controlSaludPublica: parseInt(data.controlSaludPublica || '0', 10),
            tamanio: parseInt(data.tamanio || '0', 10),
            forma: parseInt(data.forma || '0', 10),
            via: parseInt(data.via || '0', 10),
            droga: parseInt(data.droga || '0', 10),
            accion: parseInt(data.accion || '0', 10),
            vigencia: data.vigencia || '',
            precio: parseFloat(data.precio || '0'),
            unidadPotencia: parseInt(data.unidadPotencia || '0', 10),
            potencia: data.potencia || '',
            unidadUnidades: parseInt(data.unidadUnidades || '0', 10),
            unidades: parseInt(data.unidades || '0', 10),
            gtins: this.parseArray(data.gtins),
            gravamen: data.gravamen || '',
            celiacos: data.celiacos || '',
            snomed: data.snomed || '',
            ndrogas: this.parseJsonArray(data.ndrogas),
            cobs: this.parseJsonObject(data.cobs),
            prospecto: parseInt(data.prospecto || '0', 10),
            fecha_act: data.fecha_act || '',
            droga_descrip: data.droga_descrip || undefined,
            accion_descrip: data.accion_descrip || undefined,
        };
    }

    async saveDrug(drug: Drug): Promise<void> {
        const redis = getRedisClient();
        await redis.hset(`${PREFIX_DROGA}${drug.id}`, { id: drug.id.toString(), descripcion: drug.descripcion });
    }

    async saveAction(action: Action): Promise<void> {
        const redis = getRedisClient();
        await redis.hset(`${PREFIX_ACCION}${action.id}`, { id: action.id.toString(), descripcion: action.descripcion });
    }

    async saveMedication(entry: { id: number; nombre: string; estado: string; presentacion: string; droga: number; accion: number; snomed: string; precio: number; [key: string]: unknown }): Promise<void> {
        const redis = getRedisClient();
        const key = `${PREFIX_MED}${entry.id}`;
        const hashData: Record<string, string> = {};
        for (const [k, v] of Object.entries(entry)) {
            if (v === undefined || v === null) {continue;}
            if (Array.isArray(v) || typeof v === 'object') {
                hashData[k] = JSON.stringify(v);
            } else {
                hashData[k] = String(v);
            }
        }
        await redis.hset(key, hashData);

        const autocompleteMember = `${entry.nombre.toLowerCase()}|${entry.id}`;
        await redis.zadd(KEY_AUTOCOMPLETE, 0, autocompleteMember);

        if (entry.snomed) {
            await redis.set(`vademecum:snomed:${entry.snomed}`, String(entry.id));
        }
    }

    async saveMedications(entries: Array<{ id: number; nombre: string; estado: string; presentacion: string; droga: number; accion: number; snomed: string; precio: number; [key: string]: unknown }>): Promise<number> {
        if (entries.length === 0) {return 0;}
        const redis = getRedisClient();
        const pipeline = redis.pipeline();
        let saved = 0;

        for (const entry of entries) {
            const key = `${PREFIX_MED}${entry.id}`;
            const hashData: Record<string, string> = {};
            for (const [k, v] of Object.entries(entry)) {
                if (v === undefined || v === null) {continue;}
                if (Array.isArray(v) || typeof v === 'object') {
                    hashData[k] = JSON.stringify(v);
                } else {
                    hashData[k] = String(v);
                }
            }
            pipeline.hset(key, hashData);
            pipeline.zadd(KEY_AUTOCOMPLETE, 0, `${entry.nombre.toLowerCase()}|${entry.id}`);
            if (entry.snomed) {
                pipeline.set(`vademecum:snomed:${entry.snomed}`, String(entry.id));
            }
            saved++;
        }

        await pipeline.exec();
        return saved;
    }

    async updateMedicationPrice(id: number, precio: number, vigencia: string): Promise<void> {
        const redis = getRedisClient();
        await redis.hset(`${PREFIX_MED}${id}`, { precio: String(precio), vigencia, fecha_act: new Date().toISOString() });
    }

    async updateMedicationStatus(id: number, estado: string, precio?: number, vigencia?: string): Promise<void> {
        const redis = getRedisClient();
        const data: Record<string, string> = { estado, fecha_act: new Date().toISOString() };
        if (precio !== undefined) {data.precio = String(precio);}
        if (vigencia !== undefined) {data.vigencia = vigencia;}
        await redis.hset(`${PREFIX_MED}${id}`, data);
    }

    async deleteMedication(id: number): Promise<void> {
        const redis = getRedisClient();
        const key = `${PREFIX_MED}${id}`;
        const data = await redis.hgetall(key);
        if (!data || Object.keys(data).length === 0) {return;}

        const pipeline = redis.pipeline();
        pipeline.del(key);
        pipeline.zrem(KEY_AUTOCOMPLETE, `${(data.nombre || '').toLowerCase()}|${id}`);
        if (data.snomed) {
            pipeline.del(`vademecum:snomed:${data.snomed}`);
        }
        await pipeline.exec();
    }

    async setMeta(meta: Partial<VademecumMeta>): Promise<void> {
        const redis = getRedisClient();
        const data: Record<string, string> = {};
        for (const [k, v] of Object.entries(meta)) {
            if (v !== undefined && v !== null) {data[k] = String(v);}
        }
        await redis.hset(KEY_META, data);
    }

    async clearAll(): Promise<void> {
        const redis = getRedisClient();
        const keys = await redis.keys('vademecum:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }

    async countMedications(): Promise<number> {
        const redis = getRedisClient();
        return redis.zcard(KEY_AUTOCOMPLETE);
    }

    async countDrugs(): Promise<number> {
        const redis = getRedisClient();
        const keys = await redis.keys(`${PREFIX_DROGA}*`);
        return keys.length;
    }

    async countActions(): Promise<number> {
        const redis = getRedisClient();
        const keys = await redis.keys(`${PREFIX_ACCION}*`);
        return keys.length;
    }

    private parseArray(value: string | undefined): string[] {
        if (!value) {return [];}
        try { return JSON.parse(value); } catch { return []; }
    }

    private parseJsonArray(value: string | undefined): Array<{ ndroga: number; pvalor: string; punidad: number }> {
        if (!value) {return [];}
        try { return JSON.parse(value); } catch { return []; }
    }

    private parseJsonObject(value: string | undefined): Record<string, unknown> {
        if (!value) {return {};}
        try { return JSON.parse(value); } catch { return {}; }
    }
}
