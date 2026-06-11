import { initializeRedis, closeRedis } from '../src/shared/redis/redis.service';
import { VademecumRepository } from '../src/modules/vademecum/vademecum.repository';
import { Drug, Action } from '../src/modules/vademecum/vademecum.types';

const drugs: Drug[] = [
    { id: 1, descripcion: 'IBUPROFENO' },
    { id: 2, descripcion: 'PARACETAMOL' },
    { id: 3, descripcion: 'AMOXICILINA' },
    { id: 4, descripcion: 'ENALAPRIL' },
    { id: 5, descripcion: 'LOSARTAN' },
    { id: 6, descripcion: 'OMEPRAZOL' },
    { id: 7, descripcion: 'SALBUTAMOL' },
    { id: 8, descripcion: 'ATORVASTATINA' },
    { id: 9, descripcion: 'METFORMINA' },
    { id: 10, descripcion: 'DEXAMETASONA' },
    { id: 11, descripcion: 'DIAZEPAM' },
    { id: 12, descripcion: 'RANITIDINA' },
    { id: 13, descripcion: 'DICLOFENAC' },
    { id: 14, descripcion: 'AZITROMICINA' },
    { id: 15, descripcion: 'CLONAZEPAM' },
    { id: 16, descripcion: 'CEFALEXINA' },
    { id: 17, descripcion: 'TRAMADOL' },
    { id: 18, descripcion: 'CLARITROMICINA' },
    { id: 19, descripcion: 'CAPTOPRIL' },
    { id: 20, descripcion: 'TELMISARTAN' },
    { id: 21, descripcion: 'PANTOPRAZOL' },
    { id: 22, descripcion: 'BUDESONIDA' },
    { id: 23, descripcion: 'ROSUVASTATINA' },
    { id: 24, descripcion: 'GLIBENCLAMIDA' },
    { id: 25, descripcion: 'PREDNISONA' },
    { id: 26, descripcion: 'ALPRAZOLAM' },
    { id: 27, descripcion: 'FAMOTIDINA' },
    { id: 28, descripcion: 'NAPROXENO' },
    { id: 29, descripcion: 'ERITROMICINA' },
    { id: 30, descripcion: 'LORAZEPAM' },
];

const actions: Action[] = [
    { id: 1, descripcion: 'ANALGESICO' },
    { id: 2, descripcion: 'ANTIINFLAMATORIO' },
    { id: 3, descripcion: 'ANTIBIOTICO' },
    { id: 4, descripcion: 'ANTIHIPERTENSIVO' },
    { id: 5, descripcion: 'ANTIACIDO' },
    { id: 6, descripcion: 'BRONCODILATADOR' },
    { id: 7, descripcion: 'HIPOGLUCEMIANTE' },
    { id: 8, descripcion: 'DIURETICO' },
    { id: 9, descripcion: 'CORTICOIDE' },
    { id: 10, descripcion: 'ANSJOLITICO' },
];

type MedicationRecord = Record<string, unknown> & {
    id: number; nombre: string; presentacion: string; estado: string;
    droga: number; accion: number; snomed: string; precio: number;
};

const main = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('=== Seed Test Vademécum ===');

    await initializeRedis();
    const repository = new VademecumRepository();
    await repository.clearAll();

    for (const drug of drugs) {
        await repository.saveDrug(drug);
    }
    // eslint-disable-next-line no-console
    console.log(`Drogas: ${drugs.length} insertadas`);

    for (const action of actions) {
        await repository.saveAction(action);
    }
    // eslint-disable-next-line no-console
    console.log(`Acciones: ${actions.length} insertadas`);

    const labs = [12345, 67890, 11111, 22222, 33333];
    const ventas = [0, 1, 2];
    const vias = [1, 2, 3, 4, 5];
    const formas = [1, 2, 3, 4, 5, 6];

    const brandNames: Record<number, string[]> = {
        1: ['IBUPROFENO 400', 'IBUPROFENO 600', 'IBUPROFENO GOTAS', 'IBUPROFENO 800'],
        2: ['PARACETAMOL 500', 'PARACETAMOL 1G', 'PARACETAMOL GOTAS', 'PARACETAMOL 100'],
        3: ['AMOXICILINA 500', 'AMOXICILINA 1G', 'AMOXICILINA GOTAS', 'AMOXICILINA 250'],
        4: ['ENALAPRIL 5', 'ENALAPRIL 10', 'ENALAPRIL 20'],
        5: ['LOSARTAN 50', 'LOSARTAN 100'],
        6: ['OMEPRAZOL 20', 'OMEPRAZOL 40'],
        7: ['SALBUTAMOL AEROSOL', 'SALBUTAMOL SOLUCION', 'SALBUTAMOL JARABE'],
        8: ['ATORVASTATINA 10', 'ATORVASTATINA 20', 'ATORVASTATINA 40'],
        9: ['METFORMINA 500', 'METFORMINA 850', 'METFORMINA 1G'],
        10: ['DEXAMETASONA 8', 'DEXAMETASONA 4', 'DEXAMETASONA GOTAS'],
        11: ['DIAZEPAM 5', 'DIAZEPAM 10', 'DIAZEPAM GOTAS'],
        12: ['RANITIDINA 150', 'RANITIDINA 300'],
        13: ['DICLOFENAC 50', 'DICLOFENAC 75', 'DICLOFENAC GEL'],
        14: ['AZITROMICINA 500', 'AZITROMICINA 1G'],
        15: ['CLONAZEPAM 0.5', 'CLONAZEPAM 2', 'CLONAZEPAM GOTAS'],
        16: ['CEFALEXINA 500', 'CEFALEXINA 250 SUSP'],
        17: ['TRAMADOL 50', 'TRAMADOL GOTAS'],
        18: ['CLARITROMICINA 500', 'CLARITROMICINA 250 SUSP'],
        19: ['CAPTOPRIL 25', 'CAPTOPRIL 50'],
        20: ['TELMISARTAN 40', 'TELMISARTAN 80'],
        21: ['PANTOPRAZOL 20', 'PANTOPRAZOL 40'],
        22: ['BUDESONIDA AEROSOL', 'BUDESONIDA SUSP'],
        23: ['ROSUVASTATINA 10', 'ROSUVASTATINA 20'],
        24: ['GLIBENCLAMIDA 5'],
        25: ['PREDNISONA 20', 'PREDNISONA 50'],
        26: ['ALPRAZOLAM 0.5', 'ALPRAZOLAM 1'],
        27: ['FAMOTIDINA 20', 'FAMOTIDINA 40'],
        28: ['NAPROXENO 500'],
        29: ['ERITROMICINA 500', 'ERITROMICINA 250 SUSP'],
        30: ['LORAZEPAM 1', 'LORAZEPAM 2', 'LORAZEPAM GOTAS'],
    };

    const presentaciones: Record<string, string> = {
        'IBUPROFENO 400': 'COMP X 20', 'IBUPROFENO 600': 'COMP X 30',
        'IBUPROFENO GOTAS': 'FRASCO X 30ML', 'IBUPROFENO 800': 'COMP X 14',
        'PARACETAMOL 500': 'COMP X 20', 'PARACETAMOL 1G': 'COMP X 30',
        'PARACETAMOL GOTAS': 'FRASCO X 30ML', 'PARACETAMOL 100': 'COMP X 20',
        'AMOXICILINA 500': 'CAPS X 21', 'AMOXICILINA 1G': 'COMP X 14',
        'AMOXICILINA GOTAS': 'FRASCO X 60ML', 'AMOXICILINA 250': 'SUSP X 60ML',
        'ENALAPRIL 5': 'COMP X 30', 'ENALAPRIL 10': 'COMP X 30',
        'ENALAPRIL 20': 'COMP X 30', 'LOSARTAN 50': 'COMP X 30',
        'LOSARTAN 100': 'COMP X 30', 'OMEPRAZOL 20': 'CAPS X 14',
        'OMEPRAZOL 40': 'CAPS X 14', 'SALBUTAMOL AEROSOL': 'AEROSOL X 200 DOSIS',
        'SALBUTAMOL SOLUCION': 'SOL X 20ML', 'SALBUTAMOL JARABE': 'JARABE X 120ML',
        'ATORVASTATINA 10': 'COMP X 30', 'ATORVASTATINA 20': 'COMP X 30',
        'ATORVASTATINA 40': 'COMP X 30', 'METFORMINA 500': 'COMP X 60',
        'METFORMINA 850': 'COMP X 60', 'METFORMINA 1G': 'COMP X 60',
        'DEXAMETASONA 8': 'COMP X 20', 'DEXAMETASONA 4': 'COMP X 20',
        'DEXAMETASONA GOTAS': 'FRASCO X 10ML', 'DIAZEPAM 5': 'COMP X 30',
        'DIAZEPAM 10': 'COMP X 30', 'DIAZEPAM GOTAS': 'FRASCO X 20ML',
        'RANITIDINA 150': 'COMP X 30', 'RANITIDINA 300': 'COMP X 30',
        'DICLOFENAC 50': 'COMP X 20', 'DICLOFENAC 75': 'COMP X 20',
        'DICLOFENAC GEL': 'GEL X 30G', 'AZITROMICINA 500': 'COMP X 3',
        'AZITROMICINA 1G': 'COMP X 3', 'CLONAZEPAM 0.5': 'COMP X 30',
        'CLONAZEPAM 2': 'COMP X 30', 'CLONAZEPAM GOTAS': 'FRASCO X 20ML',
        'CEFALEXINA 500': 'CAPS X 21', 'CEFALEXINA 250 SUSP': 'SUSP X 60ML',
        'TRAMADOL 50': 'CAPS X 20', 'TRAMADOL GOTAS': 'FRASCO X 30ML',
        'CLARITROMICINA 500': 'COMP X 14', 'CLARITROMICINA 250 SUSP': 'SUSP X 60ML',
        'CAPTOPRIL 25': 'COMP X 30', 'CAPTOPRIL 50': 'COMP X 30',
        'TELMISARTAN 40': 'COMP X 30', 'TELMISARTAN 80': 'COMP X 30',
        'PANTOPRAZOL 20': 'COMP X 14', 'PANTOPRAZOL 40': 'COMP X 14',
        'BUDESONIDA AEROSOL': 'AEROSOL X 200 DOSIS', 'BUDESONIDA SUSP': 'SUSP X 2ML',
        'ROSUVASTATINA 10': 'COMP X 30', 'ROSUVASTATINA 20': 'COMP X 30',
        'GLIBENCLAMIDA 5': 'COMP X 30',
        'PREDNISONA 20': 'COMP X 20', 'PREDNISONA 50': 'COMP X 20',
        'ALPRAZOLAM 0.5': 'COMP X 30', 'ALPRAZOLAM 1': 'COMP X 30',
        'FAMOTIDINA 20': 'COMP X 30', 'FAMOTIDINA 40': 'COMP X 30',
        'NAPROXENO 500': 'COMP X 20',
        'ERITROMICINA 500': 'COMP X 21', 'ERITROMICINA 250 SUSP': 'SUSP X 60ML',
        'LORAZEPAM 1': 'COMP X 30', 'LORAZEPAM 2': 'COMP X 30', 'LORAZEPAM GOTAS': 'FRASCO X 20ML',
    };

    let id = 1;
    const medications: MedicationRecord[] = [];

    for (const [drugIdStr, names] of Object.entries(brandNames)) {
        const dId = Number(drugIdStr);
        for (const name of names) {
            const lab = labs[Math.floor(Math.random() * labs.length)];
            const precio = Math.round((Math.random() * 5000 + 100) * 100) / 100;
            const entry: MedicationRecord = {
                id: id++,
                nombre: name,
                presentacion: presentaciones[name] ?? 'COMP X 30',
                estado: 'V',
                droga: dId,
                accion: actions[dId % actions.length].id,
                snomed: `SNOMED${String(id).padStart(6, '0')}`,
                precio,
                laboratorio: lab,
                tipoDeVenta: ventas[Math.floor(Math.random() * ventas.length)],
                controlSaludPublica: Math.random() > 0.9 ? 1 : 0,
                tamanio: 1,
                forma: formas[Math.floor(Math.random() * formas.length)],
                via: vias[Math.floor(Math.random() * vias.length)],
                vigencia: new Date().toISOString().slice(0, 10),
                unidadPotencia: 1,
                potencia: String(Math.round(Math.random() * 500 + 10)),
                unidadUnidades: 1,
                unidades: Math.round(Math.random() * 100 + 10),
                iva: '10.5',
                gravamen: '0',
                celiacos: Math.random() > 0.95 ? 'S' : 'N',
                heladera: Math.random() > 0.9 ? 'S' : 'N',
                importado: Math.random() > 0.8 ? 'S' : 'N',
                troquel: String(Math.round(Math.random() * 99999999)),
                prospecto: Math.round(Math.random() * 100),
                codigoDeBarras: [`${Math.round(Math.random() * 1e12)}`],
                atcs: [`A${String(dId).padStart(2, '0')}AA${Math.round(Math.random() * 99)}`],
                gtins: [`${Math.round(Math.random() * 1e12)}`],
                ndrogas: [{ ndroga: dId, pvalor: String(Math.round(Math.random() * 500 + 10)), punidad: 1 }],
                cobs: {},
                fecha_act: new Date().toISOString(),
            };
            medications.push(entry);
        }
    }

    const saved = await repository.saveMedications(medications);
    // eslint-disable-next-line no-console
    console.log(`Medicamentos: ${saved} insertados`);

    await repository.setMeta({
        ultimolog: 'seed-test',
        cant_med: String(saved),
        cant_drogas: String(drugs.length),
        cant_acciones: String(actions.length),
        fecha_act: new Date().toISOString(),
    });

    // eslint-disable-next-line no-console
    console.log('=== Seed Test completado ===');

    await closeRedis();
};

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed test falló:', err);
    process.exit(1);
});
