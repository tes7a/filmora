import { AuthPageTemplate } from '../../components/templates/auth-page-template';
import { RecoverPasswordForm } from '../../components/organisms/recover-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthPageTemplate
      title="Recover your password"
      description="Request a recovery link for your account email."
    >
      <RecoverPasswordForm />
    </AuthPageTemplate>
  );
}
