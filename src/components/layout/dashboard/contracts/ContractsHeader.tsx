import { FileText, CheckCircle, Clock, AlertCircle, type LucideIcon } from 'lucide-react';
import { type FC } from 'react';

interface Stat {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string; // Tailwind class for background color
  iconColor: string; // Tailwind class for icon color
}

const ContractsHeader: FC = () => {
    // Hardcoded stats based on the mock data logic/user request to look like Leads page
    // in a real app these would come from props or a store/query
  const stats: Stat[] = [
    {
      label: 'Total Contracts',
      value: 48,
      subtitle: 'All time',
      icon: FileText,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Signed',
      value: 32,
      subtitle: 'Ready for hunt',
      icon: CheckCircle,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Pending',
      value: 12,
      subtitle: 'Awaiting signature',
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      label: 'Expired',
      value: 4,
      subtitle: 'Action required',
      icon: AlertCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card p-5 rounded-xl border shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <div className="text-3xl font-bold">{stat.value}</div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {stat.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ContractsHeader;

