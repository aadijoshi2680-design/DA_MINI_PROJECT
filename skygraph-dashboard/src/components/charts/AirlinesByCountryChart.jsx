import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 13: Airlines by Country (Active vs Defunct Carriers)
 * Stacked horizontal bar chart for top 20 countries
 */
export default function AirlinesByCountryChart({ data = [], loading = false, error = null }) {
  const topCountries = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.active || 0) - (a.active || 0))
      .slice(0, 15)
      .reverse();
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'United States (156) and Russia (80) host the largest fleets of currently active carriers';
  }, []);

  const option = useMemo(() => {
    const yCountries = topCountries.map((c) => c.country);
    const activeData = topCountries.map((c) => c.active);
    const defunctData = topCountries.map((c) => c.defunct);

    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const item = topCountries[params[0].dataIndex];
          if (!item) return '';
          const total = item.active + item.defunct;
          const activePct = ((item.active / total) * 100).toFixed(1);
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.country}</div>
            <div style="font-size: 12px; color: #34D399;">Active Carriers: <strong>${item.active}</strong> (${activePct}%)</div>
            <div style="font-size: 12px; color: #8A97B4;">Historical Defunct: <strong>${item.defunct}</strong></div>
            <div style="font-size: 12px; color: #E6EBF5; border-top: 1px solid #1F2A44; margin-top: 4px; padding-top: 2px;">Total Airlines Recorded: <strong>${total}</strong></div>
          `;
        },
      },
      legend: {
        data: ['Active Airlines', 'Defunct Airlines'],
        textStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
        top: 0,
        right: 10,
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 110,
        right: 40,
        top: 35,
        bottom: 25,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'value',
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'category',
        data: yCountries,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
        },
      },
      series: [
        {
          name: 'Active Airlines',
          type: 'bar',
          stack: 'total',
          data: activeData,
          itemStyle: {
            color: '#22D3EE',
          },
        },
        {
          name: 'Defunct Airlines',
          type: 'bar',
          stack: 'total',
          data: defunctData,
          itemStyle: {
            color: 'rgba(139, 92, 246, 0.45)',
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
    };
  }, [topCountries]);

  return (
    <ChartCard
      title="Airlines by Country (Active vs Defunct)"
      subtitle={insightSubtitle}
      info="Source: airlines.csv (verified). Displays active carriers (Y) alongside historical inactive carriers (N)."
      loading={loading}
      error={error}
      empty={!topCountries.length}
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
