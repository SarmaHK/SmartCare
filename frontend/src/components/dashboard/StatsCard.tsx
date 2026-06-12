import React from 'react';
import {
  UserCheck, Users, CalendarCheck, Award, Stethoscope, Calendar,
  Clock, TrendingUp, DollarSign, Activity
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend?: number;
  prefix?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  CalendarCheck: <CalendarCheck className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color, trend, prefix }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[4px] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{prefix}{formatNumber(value)}</p>
          {trend !== undefined && trend > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-[11px] font-medium text-green-600">+{trend}%</span>
              <span className="text-[11px] text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="w-9 h-9 rounded-[3px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}12`, color }}
        >
          {iconMap[icon] || <Activity className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
