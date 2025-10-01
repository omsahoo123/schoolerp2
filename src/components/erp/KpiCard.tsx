import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function KpiCard({ icon, title, value, description, footer, className, onClick }: KpiCardProps) {
  const isClickable = !!onClick;
  return (
    <Card className={cn("flex flex-col", isClickable && "cursor-pointer hover:shadow-lg transition-shadow", className)} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-2xl font-bold font-headline">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
      {footer && <CardFooter className="pt-0 text-sm text-muted-foreground">{footer}</CardFooter>}
    </Card>
  );
}
