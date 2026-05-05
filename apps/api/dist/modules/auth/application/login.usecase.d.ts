import type { LoginInput } from '@nutricao/shared';
import type { AuthTokens } from '@nutricao/shared';
export declare function loginUseCase(input: LoginInput): Promise<AuthTokens>;
