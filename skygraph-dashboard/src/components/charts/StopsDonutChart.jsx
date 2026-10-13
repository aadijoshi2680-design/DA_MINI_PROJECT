import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 9: Stops Distribution Donut Chart
 */
export default function StopsDonutChart({ data, loading = false, error = null }) {
  const stops = data?.stops || { '0': 65500, '1': 2100, '2+': 64 };
  const total = (stops['0'] || 0) + (stops['1'] || 0) + (stops['2+'] || 0);
  const directPct = total ? (((stops['0'] || 0) / total) * 100).toFixed(1) : '96.8';

  const insightSubtitle = useMemo(() => {
    return `${directPct}% of cataloged routes operate non-stop direct flights without technical layovers`;
  }, [directPct]);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'item',
        formatter: (params) => `
          <div style="font-weight: 600; color: #E6EBF5;">${params.name}</div>
          <div style="font-size: 13px; color: ${params.color};"><strong>${params.value?.toLocaleString()}</strong> routes (${params.percent}%)</div>
        `,
      },
      legend: {
        bottom: 10,
        textStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
      },
      series: [
        {
          name: 'Flight Stops',
          type: 'pie',
          radius: ['58%', '78%'],
          center: ['50%', '45%'],
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0E1525',
            borderWidth: 3,
          },
          label: {
            show: true,
            position: 'center',
            formatter: () => `{val|${directPct}%}\n{sub|Direct Flights}`,
            rich: {
              val: {
                fontSize: 24,
                fontWeight: 700,
                color: '#34D399',
                fontFamily: 'Space Grotesk, sans-serif',
              },
              sub: {
                fontSize: 12,
                color: '#8A97B4',
                padding: [4, 0, 0, 0],
              },
            },
          },
          data: [
            { value: stops['0'] || 65500, name: 'Direct (0 Stops)', itemStyle: { color: '#34D399' } },
            { value: stops['1'] || 2100, name: '1 Stop Transit', itemStyle: { color: '#F59E0B' } },
            { value: stops['2+'] || 64, name: '2+ Stops', itemStyle: { color: '#F87171' } },
          ],
        },
      ],
    };
  }, [stops, directPct]);

  return (
    <ChartCard
      title="Flight Stops Distribution (Direct vs Multi-Leg)"
      subtitle={insightSubtitle}
      info="Technical stopovers per scheduled route. The overwhelming majority operate direct non-stop."
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
