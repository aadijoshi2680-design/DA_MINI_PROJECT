import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 10: Codeshare Flight Partnership Share
 */
export default function CodeshareDonutChart({ data, loading = false, error = null }) {
  const codeshare = data?.codeshare || { 'Y': 9812, 'N': 57852 };
  const total = (codeshare['Y'] || 0) + (codeshare['N'] || 0);
  const codesharePct = total ? (((codeshare['Y'] || 0) / total) * 100).toFixed(1) : '14.5';

  const insightSubtitle = useMemo(() => {
    return `${codesharePct}% of commercial flight legs operate under inter-airline codeshare alliances`;
  }, [codesharePct]);

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
          name: 'Codeshare Status',
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
            formatter: () => `{val|${codesharePct}%}\n{sub|Codeshare Alliance}`,
            rich: {
              val: {
                fontSize: 24,
                fontWeight: 700,
                color: '#8B5CF6',
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
            { value: codeshare['Y'] || 9812, name: 'Codeshare Alliance Flight (Y)', itemStyle: { color: '#8B5CF6' } },
            { value: codeshare['N'] || 57852, name: 'Sole-Operated Carrier Route (N)', itemStyle: { color: '#22D3EE' } },
          ],
        },
      ],
    };
  }, [codeshare, codesharePct]);

  return (
    <ChartCard
      title="Codeshare Alliances vs Carrier Flights"
      subtitle={insightSubtitle}
      info="Measures joint ticketed flights marketed by partner airlines vs sole operating carrier routes."
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
