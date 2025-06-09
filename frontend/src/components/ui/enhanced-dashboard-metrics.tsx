import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign,
  Package, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  onClick?: () => void;
}

export function EnhancedMetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  trend = 'stable',
  color = 'blue',
  onClick
}: MetricCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    purple: 'border-purple-200 bg-purple-50 text-purple-700'
  };

  const trendIcon = {
    up: <ArrowUpRight className="h-4 w-4 text-green-600" />,
    down: <ArrowDownRight className="h-4 w-4 text-red-600" />,
    stable: <Activity className="h-4 w-4 text-gray-600" />
  };

  const changeColor = changeType === 'increase' ? 'text-green-600' : 
                     changeType === 'decrease' ? 'text-red-600' : 'text-gray-600';

  return (
    <div 
      className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-white ${
        onClick ? 'hover:bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-gray-600">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {change !== undefined && (
            <span className={`text-xs px-2 py-1 rounded ${changeColor} bg-gray-100`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
          {trendIcon[trend]}
        </div>
      </div>
    </div>
  );
}

interface DashboardMetricsProps {
  className?: string;
}

export function EnhancedDashboardMetrics({ className }: DashboardMetricsProps) {
  const metrics = [
    {
      title: "Toplam Satış",
      value: "$2,847,500",
      change: 12.5,
      changeType: 'increase' as const,
      icon: <DollarSign className="h-4 w-4" />,
      description: "Bu ay",
      trend: 'up' as const,
      color: 'green' as const
    },
    {
      title: "Aktif Stok",
      value: "15,847",
      change: -2.3,
      changeType: 'decrease' as const,
      icon: <Package className="h-4 w-4" />,
      description: "Ton",
      trend: 'down' as const,
      color: 'blue' as const
    },
    {
      title: "Aktif Cariler",
      value: "1,247",
      change: 8.1,
      changeType: 'increase' as const,
      icon: <Users className="h-4 w-4" />,
      description: "Müşteri/Tedarikçi",
      trend: 'up' as const,
      color: 'purple' as const
    },
    {
      title: "Bekleyen İşlemler",
      value: "23",
      change: 0,
      changeType: 'neutral' as const,
      icon: <Clock className="h-4 w-4" />,
      description: "Onay bekliyor",
      trend: 'stable' as const,
      color: 'yellow' as const
    },
    {
      title: "Kritik Stok",
      value: "8",
      change: -15.2,
      changeType: 'decrease' as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Minimum seviyede",
      trend: 'down' as const,
      color: 'red' as const
    },
    {
      title: "Tamamlanan İşlemler",
      value: "1,847",
      change: 18.7,
      changeType: 'increase' as const,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Bu ay",
      trend: 'up' as const,
      color: 'green' as const
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <EnhancedMetricCard
          key={index}
          {...metric}
          onClick={() => {/* TODO: Implement metric detail view */}}
        />
      ))}
    </div>
  );
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      title: "Yeni Talep",
      description: "Müşteri talebi oluştur",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Stok Girişi",
      description: "Ürün girişi kaydet",
      icon: <Package className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Fatura Kes",
      description: "Satış faturası oluştur",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Ödeme Al",
      description: "Tahsilat işlemi",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className={`p-6 rounded-lg border bg-white ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Hızlı İşlemler
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            className={`h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color}`}
            onClick={() => {/* TODO: Implement quick action */}}
          >
            {action.icon}
            <div className="text-center">
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface RecentActivitiesProps {
  className?: string;
}

export function RecentActivities({ className }: RecentActivitiesProps) {
  const activities = [
    {
      type: "Stok Girişi",
      description: "5,000 Ton Mısır - Dönmezoğlu Antrepo",
      time: "2 dakika önce",
      status: "success",
      user: "Özgür Yılmaz"
    },
    {
      type: "Fatura",
      description: "Khoshnaw - $125,000 Satış Faturası",
      time: "15 dakika önce",
      status: "pending",
      user: "Sistem"
    },
    {
      type: "Ödeme",
      description: "Global Agro - $50,000 Tahsilat",
      time: "1 saat önce",
      status: "success",
      user: "Muhasebe"
    },
    {
      type: "Talep",
      description: "Yeni Buğday Talebi - 3,000 Ton",
      time: "2 saat önce",
      status: "info",
      user: "Satış Ekibi"
    }
  ];

  const statusColors = {
    success: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800"
  };

  return (
    <div className={`p-6 rounded-lg border bg-white ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Son Aktiviteler
        </h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}>
              {activity.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">{activity.time}</p>
                <span className="text-xs text-gray-500">•</span>
                <p className="text-xs text-gray-500">{activity.user}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
        Tüm Aktiviteleri Görüntüle
      </Button>
    </div>
  );
}
