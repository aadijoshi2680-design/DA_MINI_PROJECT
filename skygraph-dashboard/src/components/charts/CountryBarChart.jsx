import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 5: Routes by Country (Top 15 Sovereign Territories)
 */
export default function CountryBarChart({ data = [], loading = false, error = null }) {
  const topCountries = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.routesOut || 0) - (a.routesOut || 0))
      .slice(0, 15)
      .reverse();
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'United States and China operate over 30% of all worldwide scheduled flight routes';
  }, []);

  const option = useMemo(() => {
    const yNames = topCountries.map((c) => c.country);
    const xRoutes = topCountries.map((c) => c.routesOut);

    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        formatter: (params) => {
          const item = topCountries[params[0].dataIndex];
          if (!item) return '';
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.country}</div>
            <div style="font-size: 12px; color: #8A97B4;">Continent: <span style="color: #E6EBF5;">${item.continent}</span></div>
            <div style="font-size: 12px; color: #22D3EE;">Outgoing Routes: <strong>${item.routesOut?.toLocaleString()}</strong></div>
            <div style="font-size: 12px; color: #8A97B4;">Commercial Airports: <strong>${item.airports}</strong></div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 110,
        right: 40,
        top: 20,
        bottom: 25,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'value',
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'category',
        data: yNames,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
        },
      },
      series: [
        {
          name: 'Outgoing Routes',
          type: 'bar',
          data: xRoutes,
          barWidth: 14,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#8B5CF6' },
                { offset: 1, color: '#22D3EE' },
              ],
            },
          },
        },
      ],
    };
  }, [topCountries]);

  return (
    <ChartCard
      title="Scheduled Routes by Country"
      subtitle={insightSubtitle}
      info="Aggregates outgoing route connections by country of origin."
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
