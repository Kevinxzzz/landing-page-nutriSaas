import { Request, Response } from 'express';
export declare function listarExamesBase(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarExameBase(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function editarExameBase(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirExameBase(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listarSolicitacoes(req: Request<{
    pacienteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function solicitarExame(req: Request<{
    pacienteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function registrarResultado(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirSolicitacao(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
