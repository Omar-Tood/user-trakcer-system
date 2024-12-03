import React from 'react';
import { LateReportCard } from './LateReportCard';
import { useStore } from '../../store/useStore';
import { generateWeeklyLateReport, generateMonthlyLateReport } from '../../utils/reports';

export function LateReports() {
  const { attendance } = useStore();
  
  const weeklyReport = generateWeeklyLateReport(attendance);
  const monthlyReport = generateMonthlyLateReport(attendance);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LateReportCard
        title="Weekly Late Returns"
        totalIncidents={weeklyReport.totalIncidents}
        averageDuration={weeklyReport.averageDuration}
        details={weeklyReport.details}
      />
      <LateReportCard
        title="Monthly Late Returns"
        totalIncidents={monthlyReport.totalIncidents}
        averageDuration={monthlyReport.averageDuration}
        details={monthlyReport.details}
      />
    </div>
  );
}