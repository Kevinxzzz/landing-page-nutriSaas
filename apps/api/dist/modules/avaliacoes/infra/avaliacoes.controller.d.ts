import { Response, Request } from "express";
export declare function buscarPorId(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarComRespostas(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function Exluir(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
