import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import type { LoginInput, ApiResponse, AuthTokens, TokenPayload } from '@nutricao/shared';

export function useLogin() {
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/login', input);
      return data.data!;
    },
    onSuccess: async (tokens) => {
      setTokens(tokens.accessToken, tokens.refreshToken);

      const { data } = await api.get<ApiResponse<TokenPayload>>('/auth/me');
      setUser(data.data!);

      navigate('/');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
}
