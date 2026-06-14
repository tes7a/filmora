type StatProps = {
  value: string;
  label: string;
};

export function Stat({ value, label }: StatProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 backdrop-blur">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}
