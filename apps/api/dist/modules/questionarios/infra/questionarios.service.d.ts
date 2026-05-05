import { CreateQuestionarioInput, CreateQuestionarioModuloInput, CreateQuestionarioRegrasInterpretacaoInput, LabelEscolhaItemInput, UpdateQuestionarioInput } from "@nutricao/shared";
type VersionamentoEstruturalResultado = {
    questionarioId: string;
    versionado: boolean;
};
type ListarQuestionariosParams = {
    incluirDeletados?: boolean;
    page: number;
    limit: number;
};
type ListarQuestionarioCompletoParams = {
    incluirDeletados?: boolean;
};
export declare function resolverQuestionarioParaMutacaoEstrutural(clinicaId: string, questionarioId: string): Promise<VersionamentoEstruturalResultado>;
export declare function criar(clinicaId: string, data: CreateQuestionarioInput): Promise<{
    nome: string;
    versao: number;
    ativo: boolean;
    clinicaId: string;
    id: string;
}>;
export declare function listar(clinicaId: string, params: ListarQuestionariosParams): Promise<{
    data: {
        id: string;
        nome: string;
        versao: number;
        ativo: boolean;
        totalModulos: number;
        modulos: {
            id: string;
            nome: string;
            ordem: number;
            totalPerguntas: number;
        }[];
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function listarModulosComPerguntas(questionarioId: string, params: ListarQuestionarioCompletoParams): Promise<{
    labelEscolha: {
        id: string;
        nota: number;
        label: string;
    }[];
    modulos: ({
        perguntas: {
            ordem: number;
            descricao: string;
            id: string;
            moduloId: string;
        }[];
    } & {
        nome: string;
        ordem: number;
        id: string;
        questionarioId: string;
    })[];
    nome: string;
    versao: number;
    ativo: boolean;
    clinicaId: string;
    id: string;
}>;
export declare function listarTitulosEscolha(clinicaId: string, questionarioId: string): Promise<{
    id: string;
    nota: number;
    label: string;
}[]>;
export declare function upsertTitulosEscolha(clinicaId: string, questionarioId: string, itens: LabelEscolhaItemInput[]): Promise<{
    id: string;
    nota: number;
    label: string;
}[]>;
export declare function atualizarTituloEscolha(clinicaId: string, questionarioId: string, nota: number, label: string): Promise<{
    id: string;
    nota: number;
    label: string;
}>;
export declare function excluirTituloEscolha(clinicaId: string, questionarioId: string, nota: number): Promise<void>;
export declare function editar(clinicaId: string, questionarioId: string, data: UpdateQuestionarioInput): Promise<{
    nome: string;
    versao: number;
    ativo: boolean;
    clinicaId: string;
    id: string;
}>;
export declare function excluir(clinicaId: string, questionarioId: string): Promise<void>;
export declare function adicionarModulo(clinicaId: string, questionarioId: string, data: CreateQuestionarioModuloInput): Promise<{
    nome: string;
    ordem: number;
    id: string;
    questionarioId: string;
}>;
export declare function adicionarRegra(clinicaId: string, questionarioId: string, data: CreateQuestionarioRegrasInterpretacaoInput): Promise<{
    pontuacaoMin: number;
    pontuacaoMax: number;
    classificacao: string;
    id: string;
    questionarioId: string;
}>;
export declare function criarQuestionarioDefault(clinicaId: string): Promise<{
    nome: string;
    versao: number;
    ativo: boolean;
    clinicaId: string;
    id: string;
}>;
export {};
