type BrandMarkProps = {
  label?: string;
};

export function BrandMark({ label = 'Filmora' }: BrandMarkProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)]">
        F
      </span>
      <span className="text-base font-semibold tracking-tight text-slate-950">
        {label}
      </span>
    </div>
  );
}
