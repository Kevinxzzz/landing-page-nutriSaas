import { Request, Response, NextFunction } from 'express';
import type { TokenPayload } from '@nutricao/shared';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void>;
export declare function getClinicaId(req: Request): string;
export declare function roleGuard(...roles: string[]): (req: Request, _res: Response, next: NextFunction) => void;
