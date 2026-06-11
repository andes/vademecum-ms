import { VademecumRepository } from './vademecum.repository';
import { VademecumEntry, Drug, Action, VademecumStats } from './vademecum.types';
import { VademecumEntryNotFoundError } from './vademecum.errors';
import { SearchMedicationsDTO, SearchDrugsDTO, SearchActionsDTO } from './vademecum.dto';

export class VademecumService {
    constructor(private readonly repository: VademecumRepository) {}

    async searchMedications(params: SearchMedicationsDTO): Promise<VademecumEntry[]> {
        const { q, drug, action, status, snomed, limit } = params;

        if (snomed) {
            const entry = await this.repository.getMedicationBySnomed(snomed);
            return entry ? [entry] : [];
        }

        if (q) {
            let results = await this.repository.searchByName(q, limit);

            if (drug !== undefined) {
                results = results.filter(r => r.droga === drug);
            }
            if (action !== undefined) {
                results = results.filter(r => r.accion === action);
            }
            if (status !== undefined) {
                results = results.filter(r => r.estado === status);
            }

            return results.slice(0, limit);
        }

        return [];
    }

    async getMedicationById(id: number): Promise<VademecumEntry> {
        const entry = await this.repository.getMedicationById(id);
        if (!entry) {
            throw new VademecumEntryNotFoundError(id);
        }
        return entry;
    }

    async searchDrugs(params: SearchDrugsDTO): Promise<Drug[]> {
        return this.repository.getDrugs(params.q, params.limit);
    }

    async searchActions(params: SearchActionsDTO): Promise<Action[]> {
        return this.repository.getActions(params.q, params.limit);
    }

    async getStats(): Promise<VademecumStats> {
        return this.repository.getStats();
    }
}
