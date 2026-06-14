import Link from 'next/link';

import { BrandMark } from '../atoms/brand-mark';
import { Button } from '../atoms/button';

export function SiteHeader() {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <BrandMark />
      <div className="flex flex-wrap items-center gap-3">
        <Button href="/films" variant="outline">
          Browse films
        </Button>
        <Button href="/profile" variant="secondary">
          Profile
        </Button>
        <Button href="/login" variant="secondary">
          Login
        </Button>
        <Button href="/register">Register</Button>
        <Link
          className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          href="/forgot-password"
        >
          Forgot password
        </Link>
      </div>
    </header>
  );
}
