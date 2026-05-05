import { CreatePacienteQuestionarioAvaliacaoInput } from "@nutricao/shared";
export declare function criarAvaliacao(id: string, questionarioId: string, data: CreatePacienteQuestionarioAvaliacaoInput): Promise<{
    pacienteId: string;
    id: string;
    dataRealizacao: Date;
    scoreTotal: number;
    questionarioId: string;
}>;
export declare function pegarAvaliacoesPorPacienteId(pacienteId: string): Promise<{
    pacienteId: string;
    id: string;
    dataRealizacao: Date;
    scoreTotal: number;
    questionarioId: string;
}[]>;
