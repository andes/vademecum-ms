import { VademecumRepository } from './vademecum.repository';
import { VademecumEntry } from './vademecum.types';
import { SearchMedicationsDTO } from './vademecum.dto';

export class VademecumService {
    constructor(private readonly repository: VademecumRepository) {}

    async searchMedications(params: SearchMedicationsDTO): Promise<VademecumEntry[]> {
        const { q, limit } = params;

        if (!q) {return [];}

        return this.repository.searchContaining(q, limit);
    }
}
