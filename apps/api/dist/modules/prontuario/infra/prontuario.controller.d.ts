import { Request, Response } from 'express';
export declare function listarEvolucoes(req: Request<{
    pacienteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarEvolucao(req: Request<{
    pacienteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function editarEvolucao(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listarMedidas(req: Request<{
    pacienteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarMedida(req: Request<{
    pacienteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirMedida(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
