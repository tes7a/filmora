import { AdminSectionTemplate } from '@/components/templates/admin-section-template';

type AdminSectionPageProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function AdminSectionPage(props: AdminSectionPageProps) {
  return <AdminSectionTemplate {...props} />;
}
