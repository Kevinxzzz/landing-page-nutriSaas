import { Request, Response } from 'express';
export declare function listar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function editar(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function alterarStatus(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluir(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
