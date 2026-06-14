'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { AuthField } from '../molecules/auth-field';
import { AuthLink } from '../molecules/auth-link';
import { Button } from '../atoms/button';
import { register } from '../../lib/api';

export function RegisterForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await register({ displayName, email, password });
      setSuccess(response.message);
      router.push('/login');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Failed to create account',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <AuthField
        label="Display name"
        name="display-name"
        placeholder="John Doe"
        autoComplete="name"
        value={displayName}
        onChange={setDisplayName}
      />
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
        placeholder="Strong password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />

      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      <div className="text-center text-sm text-slate-600">
        <span>Already have an account? </span>
        <AuthLink href="/login" label="Sign in" />
      </div>
    </form>
  );
}
