import { VademecumRepository } from '../../modules/vademecum/vademecum.repository';

import { AlfabetaClient } from './alfabeta.client';

export class AlfabetaSync {
    constructor(
        private readonly client: AlfabetaClient,
        private readonly repository: VademecumRepository,
    ) {}

    async syncFull(): Promise<{ medications: number; drugs: number; actions: number; ultimolog: number }> {
        // eslint-disable-next-line no-console
        console.log('[AlfabetaSync] Starting full sync...');

        const [catalog, drugsResp, actionsResp] = await Promise.all([
            this.client.fetchFullCatalog(),
            this.client.fetchDrugs(),
            this.client.fetchActions(),
        ]);

        const ultimolog = catalog.ultimolog;
        const medications = catalog.datos || [];
        const drugs = drugsResp.datos || [];
        const actions = actionsResp.datos || [];

        // eslint-disable-next-line no-console
        console.log(`[AlfabetaSync] Downloaded: ${medications.length} medications, ${drugs.length} drugs, ${actions.length} actions`);

        await this.repository.clearAll();
        // eslint-disable-next-line no-console
        console.log('[AlfabetaSync] Redis cleared');

        let savedMed = 0;
        if (medications.length > 0) {
            const enriched = medications.map((m) => {
                const drugDesc = drugs.find(d => d.id === m.droga)?.descripcion || '';
                const actionDesc = actions.find(a => a.id === m.accion)?.descripcion || '';
                return { ...m, droga_descrip: drugDesc, accion_descrip: actionDesc } as any;
            });
            savedMed = await this.repository.saveMedications(enriched);
            // eslint-disable-next-line no-console
            console.log(`[AlfabetaSync] Saved ${savedMed} medications to Redis`);
        }

        let savedDrugs = 0;
        for (const drug of drugs) {
            await this.repository.saveDrug({ id: drug.id, descripcion: drug.descripcion });
            savedDrugs++;
        }
        // eslint-disable-next-line no-console
        console.log(`[AlfabetaSync] Saved ${savedDrugs} drugs to Redis`);

        let savedActions = 0;
        for (const action of actions) {
            await this.repository.saveAction({ id: action.id, descripcion: action.descripcion });
            savedActions++;
        }
        // eslint-disable-next-line no-console
        console.log(`[AlfabetaSync] Saved ${savedActions} actions to Redis`);

        await this.repository.setMeta({
            ultimolog: String(ultimolog),
            cant_med: String(savedMed),
            cant_drogas: String(savedDrugs),
            cant_acciones: String(savedActions),
            fecha_act: new Date().toISOString(),
        });

        // eslint-disable-next-line no-console
        console.log('[AlfabetaSync] Full sync completed');
        return { medications: savedMed, drugs: savedDrugs, actions: savedActions, ultimolog };
    }

    async syncUpdates(): Promise<{ processed: number; created: number; deleted: number; modified: number; priceChanges: number; restored: number }> {
        const stats = await this.repository.getStats();
        const ultimolog = stats.ultimolog ? parseInt(stats.ultimolog, 10) : 0;

        // eslint-disable-next-line no-console
        console.log(`[AlfabetaSync] Fetching updates from ultimolog=${ultimolog}...`);

        const updatesResp = await this.client.fetchUpdates(ultimolog);
        const updates = updatesResp.datos || [];

        if (updates.length === 0) {
            // eslint-disable-next-line no-console
            console.log('[AlfabetaSync] No updates');
            return { processed: 0, created: 0, deleted: 0, modified: 0, priceChanges: 0, restored: 0 };
        }

        // eslint-disable-next-line no-console
        console.log(`[AlfabetaSync] Processing ${updates.length} updates...`);

        let cantA = 0; let cantM = 0; let cantB = 0; let cantP = 0; let cantR = 0;
        let maxOrden = ultimolog;

        for (const upd of updates) {
            if (upd.orden > maxOrden) {maxOrden = upd.orden;}

            switch (upd.operacion) {
            case 'A':
                if (upd.articulo) {
                    await this.repository.saveMedication(upd.articulo as any);
                    cantA++;
                }
                break;
            case 'M':
                if (upd.articulo) {
                    await this.repository.saveMedication(upd.articulo as any);
                    cantM++;
                }
                break;
            case 'R':
                if (upd.registro && upd.precio !== undefined && upd.vigencia) {
                    await this.repository.updateMedicationStatus(upd.registro, 'A', upd.precio, upd.vigencia);
                    cantR++;
                }
                break;
            case 'B':
                if (upd.registro && upd.precio !== undefined && upd.vigencia) {
                    await this.repository.updateMedicationStatus(upd.registro, 'I', upd.precio, upd.vigencia);
                    cantB++;
                }
                break;
            case 'P':
                if (upd.registro && upd.precio !== undefined && upd.vigencia) {
                    await this.repository.updateMedicationPrice(upd.registro, upd.precio, upd.vigencia);
                    cantP++;
                }
                break;
            default:
                break;
            }
        }

        const totalMed = await this.repository.countMedications();
        await this.repository.setMeta({
            ultimolog: String(maxOrden),
            cant_med: String(totalMed),
            fecha_act: new Date().toISOString(),
        });

        // eslint-disable-next-line no-console
        console.log(`[AlfabetaSync] Updates processed: ${cantA} created, ${cantM} modified, ${cantB} deleted, ${cantP} price changes, ${cantR} restored`);
        return { processed: updates.length, created: cantA, deleted: cantB, modified: cantM, priceChanges: cantP, restored: cantR };
    }
}
