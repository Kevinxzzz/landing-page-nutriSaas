import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import {
  createPacienteSchema,
  type CreatePacienteInput,
} from "@nutricao/shared";
import { api } from "@/services/api";
import { listarConvenios } from "@/services/convenios";
import styles from "./PacienteFormPage.module.scss";
import { PatternFormat } from "react-number-format";

export function PacienteFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: convenios } = useQuery({
    queryKey: ["convenios-select"],
    queryFn: () => listarConvenios(),
  });

  const { data: pacienteData } = useQuery({
    queryKey: ["paciente", id],
    queryFn: async () => {
      const { data } = await api.get(`/pacientes/${id}`);
      return data.data;
    },
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreatePacienteInput>({
    resolver: zodResolver(createPacienteSchema),
  });

  useEffect(() => {
    if (pacienteData) {
      reset({
        ...pacienteData,
        dataNascimento: pacienteData.dataNascimento
          ? pacienteData.dataNascimento.split("T")[0]
          : undefined,
        validadeCarteira: pacienteData.validadeCarteira
          ? pacienteData.validadeCarteira.split("T")[0]
          : undefined,
        convenioId: pacienteData.convenioId || undefined,
      });
    }
  }, [pacienteData, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CreatePacienteInput) => {
      if (isEditing) {
        return api.put(`/pacientes/${id}`, data);
      }
      return api.post("/pacientes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      navigate("/pacientes");
    },
  });

  return (
    <div>
      <div className={styles.header}>
        <h2>{isEditing ? "Editar Paciente" : "Novo Paciente"}</h2>
        <button
          className={styles.voltarBtn}
          onClick={() => navigate("/pacientes")}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.8} />{" "}
          Voltar
        </button>
      </div>

      <div className={styles.card}>
        {mutation.error && (
          <div className={styles.apiError}>
            {(mutation.error as any).response?.data?.message ||
              "Erro ao salvar"}
          </div>
        )}

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className={styles.section}>
            <h3>Dados Pessoais</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Nome *</label>
                <input {...register("nome")} placeholder="Nome completo" />
                {errors.nome && (
                  <span className={styles.error}>{errors.nome.message}</span>
                )}
              </div>
              <div className={styles.field}>
                <label>E-mail</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className={styles.field}>
                <label>Telefone</label>
                <Controller
                  control={control}
                  name="telefone"
                  render={({ field }) => (
                    <PatternFormat
                      value={field.value || ""}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      placeholder="(00) 0000-0000"
                      format="(##) ####-#####"
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <label>WhatsApp</label>
                <Controller
                  control={control}
                  name="whatsapp"
                  render={({ field }) => (
                    <PatternFormat
                      value={field.value || ""}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      placeholder="(00) 0000-0000"
                      format="(##) ####-#####"
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <label>Sexo</label>
                <select {...register("sexo")}>
                  <option value="">Selecione</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Data de Nascimento</label>
                <input type="date" {...register("dataNascimento")} />
              </div>
              <div className={styles.field}>
                <label>Profissão</label>
                <input {...register("profissao")} />
              </div>
              <div className={styles.field}>
                <label>Escolaridade</label>
                <input {...register("escolaridade")} />
              </div>
              <div className={styles.field}>
                <label>Nome da Mãe</label>
                <input {...register("nomeMae")} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Documentos</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>CPF</label>
                <Controller
                  control={control}
                  name="cpf"
                  render={({ field }) => (
                    <PatternFormat
                      value={field.value || ""}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      placeholder="000.000.000-00"
                      format="###.###.###-##"
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <label>Identidade</label>
                <input {...register("identidade")} />
              </div>
              <div className={styles.field}>
                <label>Órgão Expedidor</label>
                <input {...register("orgaoExpedidor")} />
              </div>
              <div className={styles.field}>
                <label>UF Identidade</label>
                <input
                  {...register("ufIdentidade")}
                  maxLength={2}
                  placeholder="UF"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Endereço</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>CEP</label>

                <Controller
                  control={control}
                  name="cep"
                  render={({ field }) => (
                    <PatternFormat
                      value={field.value || ""}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      placeholder="00000-000"
                      format="#####-###"
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <label>Endereço</label>
                <input {...register("endereco")} />
              </div>
              <div className={styles.field}>
                <label>Bairro</label>
                <input {...register("bairro")} />
              </div>
              <div className={styles.field}>
                <label>Município</label>
                <input {...register("municipio")} />
              </div>
              <div className={styles.field}>
                <label>UF</label>
                <input {...register("uf")} maxLength={2} placeholder="UF" />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Convênio</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Convênio</label>
                <select {...register("convenioId")}>
                  <option value="">Particular</option>
                  {convenios?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                {errors.convenioId && (
                  <span className={styles.error}>{errors.convenioId.message}</span>
                )}
              </div>
              <div className={styles.field}>
                <label>Número Carteira</label>
                <input {...register("numeroCarteira")} />
              </div>
              <div className={styles.field}>
                <label>Validade Carteira</label>
                <input type="date" {...register("validadeCarteira")} />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/pacientes")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Salvando..."
                : isEditing
                  ? "Salvar"
                  : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
