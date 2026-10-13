import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS, CHART_PALETTE } from '../../config/theme';

/**
 * Chart 2: Degree vs PageRank Centrality (Bubble Scatter)
 * Size = degree, Color = community
 */
export default function DegreeScatterChart({ data = [], loading = false, error = null, onAirportClick }) {
  const scatterData = useMemo(() => {
    return data.map((a) => ({
      name: a.name,
      iata: a.iata,
      city: a.city,
      country: a.country,
      value: [a.degree || 0, a.pagerank || 0],
      communityId: a.communityId || 1,
      degree: a.degree || 0,
      pagerank: a.pagerank || 0,
    }));
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'Strong correlation between raw route volume (degree) and global reach (PageRank)';
  }, []);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      grid: {
        ...baseEchartsTheme.grid,
        left: 60,
        right: 40,
        top: 30,
        bottom: 50,
      },
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'item',
        formatter: (params) => {
          const item = params.data;
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.name} (${item.iata})</div>
            <div style="font-size: 12px; color: #8A97B4;">Location: <span style="color: #E6EBF5;">${item.city}, ${item.country}</span></div>
            <div style="font-size: 12px; color: #8A97B4;">Degree: <strong style="color: #22D3EE;">${item.degree}</strong> routes</div>
            <div style="font-size: 12px; color: #8A97B4;">PageRank: <strong style="color: #F59E0B;">${item.pagerank}</strong></div>
            <div style="font-size: 12px; color: #8A97B4;">Community: <strong style="color: #8B5CF6;">Cluster #${item.communityId}</strong></div>
            <div style="font-size: 11px; margin-top: 4px; color: #22D3EE;">Click bubble to view details →</div>
          `;
        },
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'value',
        name: 'Degree (Direct Routes)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(31, 42, 68, 0.4)' } },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'value',
        name: 'PageRank',
        nameTextStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
        axisLabel: {
          formatter: (v) => v.toFixed(3),
        },
        splitLine: { lineStyle: { color: 'rgba(31, 42, 68, 0.4)' } },
      },
      series: [
        {
          name: 'Airports',
          type: 'scatter',
          data: scatterData,
          symbolSize: (val) => Math.max(10, Math.min(42, Math.sqrt(val[0]) * 1.35)),
          itemStyle: {
            color: (params) => {
              const commId = params.data?.communityId || 1;
              return CHART_PALETTE[commId % CHART_PALETTE.length];
            },
            opacity: 0.75,
            shadowBlur: 10,
            shadowColor: 'rgba(34, 211, 238, 0.25)',
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              borderColor: '#FFF',
              borderWidth: 2,
              shadowBlur: 20,
              shadowColor: '#22D3EE',
            },
          },
        },
      ],
    };
  }, [scatterData]);

  const onEvents = useMemo(() => ({
    click: (params) => {
      if (params.data && onAirportClick) {
        onAirportClick(params.data);
      }
    },
  }), [onAirportClick]);

  return (
    <ChartCard
      title="Degree Centrality vs PageRank"
      subtitle={insightSubtitle}
      info="Correlates airport direct routes count with eigenvector network importance. Nodes colored by Louvain cluster ID."
      loading={loading}
      error={error}
      empty={!scatterData.length}
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
