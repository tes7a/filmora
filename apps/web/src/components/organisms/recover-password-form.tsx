'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { AuthField } from '../molecules/auth-field';
import { AuthLink } from '../molecules/auth-link';
import { Button } from '../atoms/button';

export function RecoverPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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

      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Password recovery UI is ready. Backend endpoint for sending reset links is not
        available yet, so this screen is prepared for the next integration slice.
      </p>

      {submitted ? (
        <p className="text-sm text-emerald-600">
          If the backend reset endpoint is added, a recovery email can be sent from here.
        </p>
      ) : null}

      <Button type="submit" className="w-full">
        Request recovery link
      </Button>

      <div className="text-center text-sm text-slate-600">
        <span>Remembered your password? </span>
        <AuthLink href="/login" label="Back to sign in" />
      </div>
    </form>
  );
}
