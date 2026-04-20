type HeadingProps = {
  text: string;
};

export function Heading({ text }: HeadingProps) {
  return <h1 className="heading">{text}</h1>;
}
