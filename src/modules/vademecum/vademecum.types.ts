export interface VademecumEntry {
    id: number;
    estado: string;
    nombre: string;
    presentacion: string;
    importado: string;
    heladera: string;
    troquel: string;
    codigoDeBarras: string[];
    atcs: string[];
    iva: string;
    laboratorio: number;
    tipoDeVenta: number;
    controlSaludPublica: number;
    tamanio: number;
    forma: number;
    via: number;
    droga: number;
    accion: number;
    vigencia: string;
    precio: number;
    unidadPotencia: number;
    potencia: string;
    unidadUnidades: number;
    unidades: number;
    gtins: string[];
    gravamen: string;
    celiacos: string;
    snomed: string;
    ndrogas: Array<{ ndroga: number; pvalor: string; punidad: number }>;
    cobs: Record<string, unknown>;
    prospecto: number;
    fecha_act: string;
    droga_descrip?: string;
    accion_descrip?: string;
}

export interface Drug {
    id: number;
    descripcion: string;
}

export interface Action {
    id: number;
    descripcion: string;
}

export interface VademecumMeta {
    ultimolog: string;
    cant_med: string;
    cant_drogas: string;
    cant_acciones: string;
    fecha_act: string;
}

export interface VademecumStats {
    ultimolog: string | null;
    cant_med: number;
    cant_drogas: number;
    cant_acciones: number;
    fecha_act: string | null;
}
