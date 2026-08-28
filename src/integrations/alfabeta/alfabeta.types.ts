export interface AlfabetaMedication {
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
}

export interface AlfabetaFullCatalogResponse {
    estado: string;
    ultimolog: number;
    ultimaFechaDetalleATC?: string;
    novedades?: Array<Record<string, unknown>>;
    datos: AlfabetaMedication[];
}

export interface AlfabetaUpdate {
    operacion: 'A' | 'M' | 'B' | 'P' | 'R' | 'T' | 'C' | 'D';
    orden: number;
    tabla?: string;
    id?: number;
    descripcion?: string;
    registro?: number;
    precio?: number;
    vigencia?: string;
    articulo?: AlfabetaMedication;
}

export interface AlfabetaUpdatesResponse {
    estado: string;
    novedades?: Array<Record<string, unknown>>;
    datos: AlfabetaUpdate[];
}

export interface AlfabetaDrug {
    id: number;
    descripcion: string;
}

export interface AlfabetaDrugsResponse {
    estado: string;
    datos: AlfabetaDrug[];
}

export interface AlfabetaAction {
    id: number;
    descripcion: string;
}

export interface AlfabetaActionsResponse {
    estado: string;
    datos: AlfabetaAction[];
}
