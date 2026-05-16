import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useLogin } from '../hooks/useLogin';
import { loginFormSchema, type LoginFormValues } from '../schemas';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { Button } from '../../../components/ui/Button';

interface LoginFormProps {
  onSuccess: () => void;
}

const errorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return 'An error occurred';
};

export const LoginForm = ({ onSuccess }: LoginFormProps): ReactElement => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit((data) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success('Signed in');
        onSuccess();
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    });
  });

  const isPending = login.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormField label="Email" htmlFor="login-email" required error={errors.email?.message}>
        <Input id="login-email" type="email" autoComplete="email" autoFocus
               invalid={errors.email !== undefined}
               {...register('email')} />
      </FormField>
      <FormField label="Password" htmlFor="login-password" required error={errors.password?.message}>
        <PasswordInput id="login-password" autoComplete="current-password"
                       invalid={errors.password !== undefined}
                       {...register('password')} />
      </FormField>
      <Button type="submit" fullWidth size="lg" isLoading={isPending} loadingText="Signing in…">
        Sign in
      </Button>
    </form>
  );
};
