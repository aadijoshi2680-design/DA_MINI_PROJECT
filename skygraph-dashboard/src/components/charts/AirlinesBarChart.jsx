import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 3: Top Airlines by Route Count
 * Horizontal bar chart with amber top rank highlight and gradient fill
 */
export default function AirlinesBarChart({ data = [], activeOnly = true, loading = false, error = null, onAirlineClick }) {
  const filteredAirlines = useMemo(() => {
    let list = [...data];
    if (activeOnly) {
      list = list.filter((a) => a.active);
    }
    return list
      .filter((a) => typeof a.routeCount === 'number')
      .sort((a, b) => b.routeCount - a.routeCount)
      .slice(0, 15)
      .reverse();
  }, [data, activeOnly]);

  const insightSubtitle = useMemo(() => {
    if (!filteredAirlines.length) return 'Analyzing carrier route volumes...';
    const topCarrier = filteredAirlines[filteredAirlines.length - 1];
    return `${topCarrier?.name || 'Top carrier'} leads network throughput with ${topCarrier?.routeCount?.toLocaleString() || '2,400+'} routes`;
  }, [filteredAirlines]);

  const option = useMemo(() => {
    const yNames = filteredAirlines.map((a) => a.name);
    const xRoutes = filteredAirlines.map((a) => a.routeCount);

    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        formatter: (params) => {
          const item = filteredAirlines[params[0].dataIndex];
          if (!item) return '';
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.name} (${item.iata || item.key})</div>
            <div style="font-size: 12px; color: #8A97B4;">Country: <span style="color: #E6EBF5;">${item.country || 'Global'}</span></div>
            <div style="font-size: 12px; color: #8A97B4;">Routes: <strong style="color: #22D3EE;">${item.routeCount?.toLocaleString()}</strong></div>
            <div style="font-size: 12px; color: #8A97B4;">Active Status: <span style="color: ${item.active ? '#34D399' : '#F87171'}; font-weight: 600;">${item.active ? 'Active' : 'Defunct'}</span></div>
            <div style="font-size: 11px; margin-top: 4px; color: #22D3EE;">Click to open carrier in drawer →</div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 140,
        right: 40,
        top: 20,
        bottom: 30,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'value',
        axisLabel: {
          color: THEME_COLORS.textMuted,
          fontSize: 11,
          formatter: (v) => v.toLocaleString(),
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'category',
        data: yNames,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 12,
          formatter: (name) => (name.length > 16 ? `${name.slice(0, 15)}…` : name),
        },
      },
      series: [
        {
          name: 'Route Count',
          type: 'bar',
          data: xRoutes,
          barWidth: 14,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: (params) => {
              if (params.dataIndex === filteredAirlines.length - 1) {
                return {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#F59E0B' },
                    { offset: 1, color: '#FCD34D' },
                  ],
                };
              }
              return {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: '#8B5CF6' },
                  { offset: 1, color: '#22D3EE' },
                ],
              };
            },
          },
        },
      ],
    };
  }, [filteredAirlines]);

  const onEvents = useMemo(() => ({
    click: (params) => {
      const selected = filteredAirlines[params.dataIndex];
      if (selected && onAirlineClick) {
        onAirlineClick(selected);
      }
    },
  }), [filteredAirlines, onAirlineClick]);

  return (
    <ChartCard
      title="Top 15 Airlines by Scheduled Routes"
      subtitle={insightSubtitle}
      info="Aggregated outgoing and incoming routes per carrier. Top carrier highlighted in amber."
      loading={loading}
      error={error}
      empty={!filteredAirlines.length}
    >
      <div className="w-full h-80 sm:h-96">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          onEvents={onEvents}
          notMerge={true}
        />
      </div>
    </ChartCard>
  );
}
