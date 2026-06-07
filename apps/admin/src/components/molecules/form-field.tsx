import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormFieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  autoComplete?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function FormField({
  id,
  label,
  type = 'text',
  value,
  autoComplete,
  placeholder,
  onChange,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}
