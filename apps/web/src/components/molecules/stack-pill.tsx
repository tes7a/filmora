type StackPillProps = {
  text: string;
};

export function StackPill({ text }: StackPillProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
      {text}
    </span>
  );
}
