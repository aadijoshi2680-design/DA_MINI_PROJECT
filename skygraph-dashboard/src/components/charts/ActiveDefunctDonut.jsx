import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 14: Active vs Defunct Airlines Donut Chart
 * 70% inner radius with center headline percentage
 */
export default function ActiveDefunctDonut({ summary, loading = false, error = null }) {
  const activeCount = summary?.activeAirlines || 1254;
  const totalCount = summary?.airlines || 6160;
  const defunctCount = Math.max(0, totalCount - activeCount);
  const activePct = ((activeCount / totalCount) * 100).toFixed(1);

  const insightSubtitle = useMemo(() => {
    return `Only ${activePct}% of recorded airlines in the OpenFlights database remain operational`;
  }, [activePct]);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'item',
        formatter: (params) => {
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${params.name}</div>
            <div style="font-size: 13px; color: ${params.color};"><strong>${params.value?.toLocaleString()}</strong> airlines (${params.percent}%)</div>
          `;
        },
      },
      legend: {
        bottom: 10,
        textStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
      },
      series: [
        {
          name: 'Operational Status',
          type: 'pie',
          radius: ['58%', '78%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0E1525',
            borderWidth: 3,
          },
          label: {
            show: true,
            position: 'center',
            formatter: () => `{val|${activePct}%}\n{sub|Active Rate}`,
            rich: {
              val: {
                fontSize: 26,
                fontWeight: 700,
                color: '#22D3EE',
                fontFamily: 'Space Grotesk, sans-serif',
              },
              sub: {
                fontSize: 12,
                color: '#8A97B4',
                padding: [4, 0, 0, 0],
              },
            },
          },
          emphasis: {
            label: {
              show: true,
            },
          },
          data: [
            {
              value: activeCount,
              name: 'Active Airlines',
              itemStyle: { color: '#22D3EE' },
            },
            {
              value: defunctCount,
              name: 'Defunct Carriers',
              itemStyle: { color: 'rgba(139, 92, 246, 0.4)' },
            },
          ],
        },
      ],
    };
  }, [activeCount, defunctCount, activePct]);

  return (
    <ChartCard
      title="Fleet Viability: Active vs Defunct Airlines"
      subtitle={insightSubtitle}
      info="Airlines cataloged in OpenFlights: 1,254 active (Y) vs 4,906 inactive/defunct (N)."
      loading={loading}
      error={error}
    >
      <div className="w-full h-80 sm:h-96">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
        />
      </div>
    </ChartCard>
  );
}
