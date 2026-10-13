import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 6: Global Route Network Density
 * Measures routes-per-airport infrastructure density across top nations
 */
export default function RouteDensityChart({ data = [], loading = false, error = null }) {
  const densityData = useMemo(() => {
    return [...data]
      .filter((c) => c.airports > 10)
      .map((c) => ({
        country: c.country,
        density: Number(((c.routesOut || 0) / (c.airports || 1)).toFixed(1)),
        routes: c.routesOut,
        airports: c.airports,
      }))
      .sort((a, b) => b.density - a.density)
      .slice(0, 12);
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'Spain, Germany and the UK exhibit the highest route density per commercial airport';
  }, []);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        formatter: (params) => {
          const item = densityData[params[0].dataIndex];
          if (!item) return '';
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.country}</div>
            <div style="font-size: 12px; color: #F59E0B;">Route Density: <strong>${item.density}</strong> routes/airport</div>
            <div style="font-size: 12px; color: #8A97B4;">Airports: <strong>${item.airports}</strong> • Routes: <strong>${item.routes?.toLocaleString()}</strong></div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 45,
        right: 20,
        top: 25,
        bottom: 50,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'category',
        data: densityData.map((d) => d.country),
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
          rotate: 25,
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'value',
        name: 'Routes / Airport',
        nameTextStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
      },
      series: [
        {
          name: 'Route Density',
          type: 'bar',
          data: densityData.map((d) => d.density),
          barWidth: 16,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#F59E0B' },
                { offset: 1, color: '#22D3EE' },
              ],
            },
          },
        },
      ],
    };
  }, [densityData]);

  return (
    <ChartCard
      title="Global Route Infrastructure Density"
      subtitle={insightSubtitle}
      info="Calculates the ratio of total routes to active commercial airports per nation."
      loading={loading}
      error={error}
      empty={!densityData.length}
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
