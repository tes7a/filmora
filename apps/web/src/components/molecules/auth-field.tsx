import { Input } from '../atoms/input';
import { Label } from '../atoms/label';

type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
};

export function AuthField({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
}: AuthFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-slate-700" htmlFor={name}>
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
