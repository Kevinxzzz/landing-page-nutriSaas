export declare function getQuestionarioPadraoNome(): string;
export declare function criarQuestionarioPadraoParaClinica(clinicaId: string): Promise<{
    nome: string;
    versao: number;
    ativo: boolean;
    clinicaId: string;
    id: string;
}>;
