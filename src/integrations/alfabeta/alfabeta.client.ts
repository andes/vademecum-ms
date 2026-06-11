import axios, { AxiosInstance } from 'axios';

import { InternalError } from '../../shared/errors';

import {
    AlfabetaFullCatalogResponse,
    AlfabetaUpdatesResponse,
    AlfabetaDrugsResponse,
    AlfabetaActionsResponse,
} from './alfabeta.types';

export interface AlfabetaClientConfig {
    endpoint: string;
    usuario: string;
    clave: string;
}

export class AlfabetaClient {
    private client: AxiosInstance;
    private configured: boolean;

    constructor(config: AlfabetaClientConfig) {
        const { endpoint, usuario, clave } = config;
        this.configured = !!(endpoint && usuario && clave);

        if (!this.configured) {
            this.client = axios.create();
            return;
        }

        this.client = axios.create({
            baseURL: endpoint,
            headers: { usuario, clave },
            timeout: 120000,
        });
    }

    private ensureConfigured(): void {
        if (!this.configured) {
            throw new InternalError('Alfabeta client no configurado. Verificar ALFABETA_ENDPOINT, ALFABETA_USUARIO y ALFABETA_CLAVE.');
        }
    }

    async fetchFullCatalog(): Promise<AlfabetaFullCatalogResponse> {
        this.ensureConfigured();
        const response = await this.client.get<AlfabetaFullCatalogResponse>('/base_completa');
        return response.data;
    }

    async fetchUpdates(ultimolog: number): Promise<AlfabetaUpdatesResponse> {
        this.ensureConfigured();
        const response = await this.client.get<AlfabetaUpdatesResponse>('/novedades', {
            params: { ultimologmf: ultimolog },
        });
        return response.data;
    }

    async fetchDrugs(): Promise<AlfabetaDrugsResponse> {
        this.ensureConfigured();
        const response = await this.client.get<AlfabetaDrugsResponse>('/drogas');
        return response.data;
    }

    async fetchActions(): Promise<AlfabetaActionsResponse> {
        this.ensureConfigured();
        const response = await this.client.get<AlfabetaActionsResponse>('/acciones');
        return response.data;
    }
}
