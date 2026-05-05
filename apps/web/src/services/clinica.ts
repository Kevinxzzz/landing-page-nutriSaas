import { api } from "@/services/api";
import type {
  OnboardingInput,
  ApiResponse,
  AuthTokens,
  TokenPayload,
} from "@nutricao/shared";

export interface OnboardingResult {
  clinica: unknown;
  tokens: AuthTokens;
}

export async function postOnboarding(input: OnboardingInput): Promise<OnboardingResult> {
  const { data } = await api.post<ApiResponse<OnboardingResult>>(
    "/clinica/onboarding",
    input,
  );
  return data.data!;
}

export async function getMe(): Promise<TokenPayload> {
  const { data } = await api.get<ApiResponse<TokenPayload>>("/auth/me");
  return data.data!;
}
