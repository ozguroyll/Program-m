import { Badge } from './badge';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}

interface CurrencyCellProps {
  amount: number;
  currency: string;
  className?: string;
}

export function CurrencyCell({ amount, currency, className }: CurrencyCellProps) {
  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });

  return (
    <span className={cn("font-medium", className)}>
      {formatter.format(amount)}
    </span>
  );
}
