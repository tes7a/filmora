type EyebrowProps = {
  text: string;
};

export function Eyebrow({ text }: EyebrowProps) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
      {text}
    </p>
  );
}
