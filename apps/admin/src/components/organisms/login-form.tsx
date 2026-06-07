import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/molecules/form-field';
import { useAuthStore } from '@/store/auth.store';

export function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const clearError = useAuthStore((state) => state.clearError);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    clearError();

    try {
      await login({ email, password });
      navigate('/admin', { replace: true });
    } catch {
      // Error is handled in auth store.
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        autoComplete="email"
        placeholder="admin@example.com"
        onChange={setEmail}
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        autoComplete="current-password"
        placeholder="Enter password"
        onChange={setPassword}
      />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {status === 'authenticated' && user ? (
        <p className="text-sm text-green-700">Signed in as {user.displayName}</p>
      ) : null}

      <Button disabled={isLoading} type="submit">
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
