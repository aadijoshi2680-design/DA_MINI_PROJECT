import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 11: Aircraft Equipment Usage
 * Top commercial airframes deployed on scheduled routes
 */
export default function EquipmentBarChart({ data = [], loading = false, error = null }) {
  const topEquipment = useMemo(() => {
    return [...data].slice(0, 10);
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'Narrow-body workhorses Airbus A320 and Boeing 737-800 account for the bulk of global operations';
  }, []);

  const option = useMemo(() => {
    const xCodes = topEquipment.map((eq) => `${eq.code} (${eq.name ? eq.name.split(' ')[0] : 'Jet'})`);
    const yCounts = topEquipment.map((eq) => eq.count);

    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        formatter: (params) => {
          const item = topEquipment[params[0].dataIndex];
          if (!item) return '';
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.name || item.code} (IATA: ${item.code})</div>
            <div style="font-size: 13px; color: #22D3EE;">Scheduled Deployments: <strong>${item.count?.toLocaleString()}</strong> routes</div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 50,
        right: 20,
        top: 25,
        bottom: 55,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'category',
        data: xCodes,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
          rotate: 30,
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'value',
      },
      series: [
        {
          name: 'Routes Operated',
          type: 'bar',
          data: yCounts,
          barWidth: 16,
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
  }, [topEquipment]);

  return (
    <ChartCard
      title="Aircraft Equipment Usage (Top Airframes)"
      subtitle={insightSubtitle}
      info="Parsed from routes.csv equipment codes. Reflects airframe utilization frequency across flights."
      loading={loading}
      error={error}
      empty={!topEquipment.length}
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
