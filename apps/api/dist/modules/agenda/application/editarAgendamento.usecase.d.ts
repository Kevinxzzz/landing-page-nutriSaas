import type { UpdateAgendamentoInput } from '@nutricao/shared';
export declare function editarAgendamentoUseCase(id: string, input: UpdateAgendamentoInput): Promise<{
    convenio: {
        nome: string;
        id: string;
    } | null;
    paciente: {
        email: string | null;
        nome: string;
        telefone: string | null;
        id: string;
    };
} & {
    status: import("../../../../prisma/generated/client/index.js").$Enums.StatusAgendamento;
    convenioId: string | null;
    pacienteId: string;
    dataHora: Date;
    tipo: import("../../../../prisma/generated/client/index.js").$Enums.TipoAgendamento;
    encaixe: boolean;
    observacao: string | null;
    clinicaId: string;
    id: string;
    criadoEm: Date;
    atualizadoEm: Date;
    usuarioId: string;
}>;
