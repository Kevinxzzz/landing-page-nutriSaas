import { Request, Response } from "express";
export declare function criarPergunta(req: Request<{
    moduloId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function editarModulo(req: Request<{
    moduloId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirModulo(req: Request<{
    moduloId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function editarPergunta(req: Request<{
    moduloId: string;
    perguntaId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirPergunta(req: Request<{
    moduloId: string;
    perguntaId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
