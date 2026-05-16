import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginFormValues } from '../services/auth.service';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormValues) => authService.login(data),
  });
};
