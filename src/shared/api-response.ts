interface SuccessResponse<T> {
    status: 'success';
    data: T;
}

interface ErrorResponse {
    status: 'error';
    error: {
        code: string;
        message: string;
        details?: unknown[];
    };
}

export const ApiResponse = {
    success: <T>(data: T): SuccessResponse<T> => ({ status: 'success' as const, data }),

    error: (code: string, message: string, details?: unknown[]): ErrorResponse => ({
        status: 'error' as const,
        error: { code, message, ...(details ? { details } : {}) },
    }),
};
