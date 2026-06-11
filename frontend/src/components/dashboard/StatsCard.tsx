import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck, Users, CalendarCheck, Award, Stethoscope, Calendar,
  Clock, TrendingUp, DollarSign, Activity
} from 'lucide-react';
import { staggerItem } from '../../hooks/useAnimations';
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
  UserCheck: <UserCheck className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  CalendarCheck: <CalendarCheck className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  DollarSign: <DollarSign className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color, trend, prefix }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      variants={staggerItem}
      className="bg-surface rounded-2xl border border-border shadow-card p-6 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl lg:text-3xl font-bold text-text-primary">
            {prefix}{formatNumber(displayValue)}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">+{trend}%</span>
              <span className="text-xs text-text-muted">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {iconMap[icon] || <Activity className="w-6 h-6" />}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
