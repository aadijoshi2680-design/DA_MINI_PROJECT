import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 1: Top Hub Airports by PageRank Centrality
 * Horizontal bar with amber top highlight and cyan->violet gradient fill
 */
export default function HubsBarChart({ data = [], loading = false, error = null, onHubClick }) {
  const topHubs = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.pagerank || 0) - (a.pagerank || 0))
      .slice(0, 15)
      .reverse(); // For horizontal bottom-to-top rendering
  }, [data]);

  const insightSubtitle = useMemo(() => {
    if (!data.length) return 'Analyzing airport network centrality...';
    const top3 = data.slice(0, 3).map((d) => d.city || d.iata).join(', ');
    return `${top3} dominate global connectivity with highest graph influence`;
  }, [data]);

  const option = useMemo(() => {
    const yData = topHubs.map((d) => `${d.city} (${d.iata})`);
    const xData = topHubs.map((d) => d.pagerank);

    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        formatter: (params) => {
          const item = topHubs[params[0].dataIndex];
          if (!item) return '';
          return `
            <div style="font-weight: 600; margin-bottom: 4px; color: #E6EBF5;">${item.name} (${item.iata})</div>
            <div style="font-size: 12px; color: #8A97B4;">Country: <span style="color: #E6EBF5;">${item.country}</span></div>
            <div style="font-size: 12px; color: #8A97B4;">PageRank: <strong style="color: #22D3EE;">${item.pagerank}</strong></div>
            <div style="font-size: 12px; color: #8A97B4;">Direct Routes: <strong style="color: #F59E0B;">${item.degree}</strong></div>
            <div style="font-size: 11px; margin-top: 4px; color: #22D3EE;">Click to inspect hub in drawer →</div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 120,
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
          formatter: (v) => v.toFixed(3),
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'category',
        data: yData,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'PageRank Score',
          type: 'bar',
          data: xData,
          barWidth: 14,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: (params) => {
              // Highlight highest ranked airport in amber
              if (params.dataIndex === topHubs.length - 1) {
                return {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#F59E0B' },
                    { offset: 1, color: '#FBBF24' },
                  ],
                };
              }
              // Other bars gradient cyan -> violet
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
  }, [topHubs]);

  const onEvents = useMemo(() => ({
    click: (params) => {
      const selected = topHubs[params.dataIndex];
      if (selected && onHubClick) {
        onHubClick(selected);
      }
    },
  }), [topHubs, onHubClick]);

  return (
    <ChartCard
      title="Top 15 Hub Airports by PageRank"
      subtitle={insightSubtitle}
      info="PageRank reflects probability of reaching an airport via random network hops. Computed via Neo4j Graph Data Science."
      loading={loading}
      error={error}
      empty={!data.length}
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
