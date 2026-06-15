import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { adminService, type ReportData } from '../../services/admin.service';
import { ReportChart } from './components/ReportChart';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { StatsCard } from '../../components/cards/StatsCard';
import { CheckCircle, XCircle, BarChart2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const response = await adminService.getReports();
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!reportData) {
    return (
      <EmptyState
        icon={<BarChart2 className="h-7 w-7" />}
        title="Unable to load reports"
        description="There was a problem fetching analytics data. Please try again later."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Analytics"
        description="Visualize appointment trends and platform health metrics."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatsCard
          title="Completion Rate"
          value={`${reportData.completionRate}%`}
          description="Appointments successfully completed"
          icon={<CheckCircle className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Cancellation Rate"
          value={`${reportData.cancellationRate}%`}
          description="Appointments cancelled by either party"
          icon={<XCircle className="h-6 w-6" />}
          iconClassName="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReportChart
          title="Daily Appointments (Last 7 Days)"
          data={reportData.daily.map((d) => ({ label: d.date, value: d.count }))}
          type="bar"
          color="#2563eb"
        />

        <ReportChart
          title="Weekly Appointments Trend"
          data={reportData.weekly.map((d) => ({ label: d.week, value: d.count }))}
          type="line"
          color="#1d4ed8"
        />

        <div className="xl:col-span-2">
          <ReportChart
            title="Monthly Appointments Overview"
            data={reportData.monthly.map((d) => ({ label: d.month, value: d.count }))}
            type="bar"
            color="#3b82f6"
          />
        </div>
      </div>
    </div>
  );
};
