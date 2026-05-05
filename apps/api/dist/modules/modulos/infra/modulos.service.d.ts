import { CreateModuloPerguntaInput, UpdateModuloPerguntaInput, UpdateQuestionarioModuloInput } from "@nutricao/shared";
export declare function criarPergunta(clinicaId: string, moduloId: string, data: CreateModuloPerguntaInput): Promise<{
    ordem: number;
    descricao: string;
    id: string;
    moduloId: string;
}>;
export declare function editarModulo(clinicaId: string, moduloId: string, data: UpdateQuestionarioModuloInput): Promise<{
    nome: string;
    ordem: number;
    id: string;
    questionarioId: string;
}>;
export declare function excluirModulo(clinicaId: string, moduloId: string): Promise<void>;
export declare function editarPergunta(clinicaId: string, moduloId: string, perguntaId: string, data: UpdateModuloPerguntaInput): Promise<{
    ordem: number;
    descricao: string;
    id: string;
    moduloId: string;
}>;
export declare function excluirPergunta(clinicaId: string, moduloId: string, perguntaId: string): Promise<void>;
