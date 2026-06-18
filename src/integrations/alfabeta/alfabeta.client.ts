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

    private ensureOk(estado: string | undefined, endpoint: string): void {
        if (!estado || estado !== 'OK') {
            throw new InternalError(`Alfabeta respondió con estado "${estado}" en ${endpoint}. Verificar credenciales y parámetros.`);
        }
    }

    private decodeServerError(error: unknown): string {
        if (axios.isAxiosError(error) && error.response?.headers?.['x-error']) {
            try {
                return Buffer.from(error.response.headers['x-error'], 'base64').toString('utf8');
            } catch {
                return error.response.headers['x-error'];
            }
        }
        return '';
    }

    private async request<T>(path: string, options?: Record<string, unknown>): Promise<T> {
        try {
            const response = await this.client.get<T>(path, options);
            return response.data;
        } catch (error) {
            const serverError = this.decodeServerError(error);
            const detail = serverError ? ` Detalle servidor: ${serverError}` : '';
            throw new InternalError(`Error consultando Alfabeta (${path}).${detail}`);
        }
    }

    async fetchFullCatalog(): Promise<AlfabetaFullCatalogResponse> {
        this.ensureConfigured();
        const response = await this.request<AlfabetaFullCatalogResponse>('/ifarmacia/base-completa', {
            params: { test: false },
        });
        this.ensureOk(response.estado, '/ifarmacia/base-completa');
        return response;
    }

    async fetchUpdates(ultimolog: number): Promise<AlfabetaUpdatesResponse> {
        this.ensureConfigured();
        const response = await this.request<AlfabetaUpdatesResponse>('/ifarmacia/novedades', {
            params: { ultimologmf: ultimolog },
        });
        const estado = response.estado;
        if (estado && estado !== 'OK' && estado !== 'SIN_NOVEDADES') {
            throw new InternalError(`Alfabeta respondió con estado "${estado}" en /ifarmacia/novedades.`);
        }
        return response;
    }

    async fetchDrugs(): Promise<AlfabetaDrugsResponse> {
        this.ensureConfigured();
        const response = await this.request<AlfabetaDrugsResponse>('/ifarmacia/drogas');
        this.ensureOk(response.estado, '/ifarmacia/drogas');
        return response;
    }

    async fetchActions(): Promise<AlfabetaActionsResponse> {
        this.ensureConfigured();
        const response = await this.request<AlfabetaActionsResponse>('/ifarmacia/acciones');
        this.ensureOk(response.estado, '/ifarmacia/acciones');
        return response;
    }
}
