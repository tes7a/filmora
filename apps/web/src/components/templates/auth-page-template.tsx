import type { ReactNode } from 'react';

import { AuthShell } from '../organisms/auth-shell';

type AuthPageTemplateProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthPageTemplate({
  title,
  description,
  children,
  footer,
}: AuthPageTemplateProps) {
  return (
    <AuthShell title={title} description={description} footer={footer}>
      {children}
    </AuthShell>
  );
}
