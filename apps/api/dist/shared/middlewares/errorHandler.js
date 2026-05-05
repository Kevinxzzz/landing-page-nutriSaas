import { ZodError } from 'zod';
export class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (err instanceof ZodError) {
        return res.status(422).json({
            success: false,
            message: 'Erro de validação',
            errors: err.flatten().fieldErrors,
        });
    }
    console.error('Unexpected error:', err);
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
    });
}
