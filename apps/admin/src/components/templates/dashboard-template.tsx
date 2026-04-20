import { Heading } from '@/components/atoms/heading';
import { SectionMessage } from '@/components/molecules/section-message';
import { AppShell } from '@/components/organisms/app-shell';

type DashboardTemplateProps = {
  title: string;
  description: string;
};

export function DashboardTemplate({ title, description }: DashboardTemplateProps) {
  return (
    <AppShell>
      <Heading text={title} />
      <SectionMessage description={description} />
    </AppShell>
  );
}
