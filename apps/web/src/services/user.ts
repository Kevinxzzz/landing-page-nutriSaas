import type { ApiResponse } from "@nutricao/shared";
import { api } from "./api";

export async function esqueciSenha(email: string) {
  const { data: res } = await api.post<ApiResponse>("/usuarios/esqueci-senha", {
    email,
  });
  return res.data!;
}

export async function redefinirSenha(novaSenha: string) {
  const { data: res } = await api.post<ApiResponse>(
    "/usuarios/redefinir-senha",
    {
      // token,
      novaSenha,
    },
  );
  return res.data!;
}
