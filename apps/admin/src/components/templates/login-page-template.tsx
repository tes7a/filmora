import { LoginForm } from '@/components/organisms/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type LoginPageTemplateProps = {
  title: string;
  subtitle: string;
};

export function LoginPageTemplate({ title, subtitle }: LoginPageTemplateProps) {
  return (
    <main className="login-page">
      <Card className="w-full max-w-[440px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
