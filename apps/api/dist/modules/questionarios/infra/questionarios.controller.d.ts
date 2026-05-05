import { Request, Response } from "express";
export declare function listar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarPorId(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listarTitulosEscolha(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function upsertTitulosEscolha(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarTituloEscolha(req: Request<{
    id: string;
    nota: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirTituloEscolha(req: Request<{
    id: string;
    nota: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarModulo(req: Request<{
    questionarioId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarRegra(req: Request<{
    questionarioId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarDefault(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function editar(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluir(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
