'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { AuthField } from '../molecules/auth-field';
import { AuthLink } from '../molecules/auth-link';
import { Button } from '../atoms/button';
import { login } from '../../lib/api';
import { saveAuthSession } from '../../lib/config/auth-storage';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      saveAuthSession(response.accessToken, response.user);
      router.push('/profile');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Failed to log in',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        placeholder="Your password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
      />

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-sm">
        <AuthLink href="/register" label="Create account" />
        <AuthLink href="/forgot-password" label="Forgot password?" />
      </div>
    </form>
  );
}
