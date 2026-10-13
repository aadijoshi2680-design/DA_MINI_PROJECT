import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 8: Route Distance Distribution Histogram
 */
export default function DistanceHistChart({ data, loading = false, error = null }) {
  const bins = data?.bins || [];
  const counts = data?.counts || [];

  const insightSubtitle = useMemo(() => {
    return 'Over 55% of global scheduled routes fall in the 500–2,000 km short-to-medium haul bracket';
  }, []);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        formatter: (params) => {
          const idx = params[0].dataIndex;
          return `
            <div style="font-weight: 600; color: #E6EBF5;">Distance Bin: ${bins[idx]}</div>
            <div style="font-size: 13px; color: #22D3EE;">Scheduled Routes: <strong>${counts[idx]?.toLocaleString()}</strong></div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 55,
        right: 20,
        top: 25,
        bottom: 45,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'category',
        data: bins,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
          rotate: 15,
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'value',
        name: 'Route Count',
        nameTextStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
      },
      series: [
        {
          name: 'Routes',
          type: 'bar',
          data: counts,
          barWidth: '60%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#22D3EE' },
                { offset: 1, color: '#8B5CF6' },
              ],
            },
          },
        },
      ],
    };
  }, [bins, counts]);

  return (
    <ChartCard
      title="Route Distance Distribution (Great-Circle km)"
      subtitle={insightSubtitle}
      info="Haversine distance distribution calculated between airport coordinate pairs."
      loading={loading}
      error={error}
      empty={!bins.length}
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
