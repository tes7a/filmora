type SectionMessageProps = {
  description: string;
};

export function SectionMessage({ description }: SectionMessageProps) {
  return <p className="section-message">{description}</p>;
}
