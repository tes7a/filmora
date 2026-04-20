import { Heading } from '../atoms/heading';
import { SectionMessage } from '../molecules/section-message';
import { AppShell } from '../organisms/app-shell';

type LandingTemplateProps = {
  title: string;
  description: string;
};

export function LandingTemplate({ title, description }: LandingTemplateProps) {
  return (
    <AppShell>
      <Heading text={title} />
      <SectionMessage description={description} />
    </AppShell>
  );
}
