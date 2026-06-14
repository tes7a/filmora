import { AuthPageTemplate } from '../../components/templates/auth-page-template';
import { LoginForm } from '../../components/organisms/login-form';

export default function LoginPage() {
  return (
    <AuthPageTemplate
      title="Sign in to Filmora"
      description="Access your account, save favorites, rate films, and continue where you left off."
    >
      <LoginForm />
    </AuthPageTemplate>
  );
}
