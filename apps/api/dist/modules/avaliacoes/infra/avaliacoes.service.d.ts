export declare function pegarAvaliacaoPorId(id: string): Promise<{
    regraInterpretacao: {
        classificacao: string;
    } | null;
    pacienteId: string;
    id: string;
    dataRealizacao: Date;
    scoreTotal: number;
    questionarioId: string;
}>;
export declare function pegarAvaliacaoComRespostas(id: string): Promise<{
    regraInterpretacao: string | undefined;
    questionario: {
        modulos: ({
            perguntas: ({
                respostas: {
                    perguntaId: string;
                    nota: number;
                    pacienteId: string;
                    id: string;
                    avaliacaoId: string;
                }[];
            } & {
                ordem: number;
                descricao: string;
                id: string;
                moduloId: string;
            })[];
        } & {
            nome: string;
            ordem: number;
            id: string;
            questionarioId: string;
        })[];
        labelEscolha: {
            nota: number;
            label: string;
            id: string;
            questionarioId: string;
        }[];
        regras: {
            pontuacaoMin: number;
            pontuacaoMax: number;
            classificacao: string;
            id: string;
            questionarioId: string;
        }[];
    } & {
        nome: string;
        versao: number;
        ativo: boolean;
        clinicaId: string;
        id: string;
    };
    pacienteId: string;
    id: string;
    dataRealizacao: Date;
    scoreTotal: number;
    questionarioId: string;
}>;
export declare function DeleteAvaliacao(id: string): Promise<void>;
