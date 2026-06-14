import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="group border-slate-200/80 bg-white/90 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <CardHeader className="space-y-3 pb-3">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          Feature
        </Badge>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 text-sm leading-6 text-slate-600">
        {description}
      </CardContent>
    </Card>
  );
}
