import Link from 'next/link';

type AuthLinkProps = {
  href: string;
  label: string;
};

export function AuthLink({ href, label }: AuthLinkProps) {
  return (
    <Link
      className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
      href={href}
    >
      {label}
    </Link>
  );
}
