import { AuthPageTemplate } from '../../components/templates/auth-page-template';
import { RegisterForm } from '../../components/organisms/register-form';

export default function RegisterPage() {
  return (
    <AuthPageTemplate
      title="Create your Filmora account"
      description="Register once and keep your ratings, lists, and profile in sync across the app."
    >
      <RegisterForm />
    </AuthPageTemplate>
  );
}
