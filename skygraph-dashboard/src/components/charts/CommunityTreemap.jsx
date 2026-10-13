import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, CHART_PALETTE, THEME_COLORS } from '../../config/theme';

/**
 * Chart 7: Network Communities Treemap
 * Decision 1: Treemap representing Louvain modularity clusters
 */
export default function CommunityTreemap({ data = [], loading = false, error = null }) {
  const treeData = useMemo(() => {
    return data.map((comm, idx) => ({
      name: `${comm.label}\nHub: ${comm.topAirport}`,
      value: comm.size,
      topCountries: comm.topCountries || [],
      topAirport: comm.topAirport,
      itemStyle: {
        color: CHART_PALETTE[idx % CHART_PALETTE.length],
        borderColor: '#0E1525',
        borderWidth: 2,
        borderRadius: 6,
      },
    }));
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'Louvain modularity algorithm groups global airports into 9 distinct continental clusters';
  }, []);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        formatter: (params) => {
          const item = params.data;
          const countries = item.topCountries?.join(', ') || 'Global';
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${item.name.replace('\n', ' — ')}</div>
            <div style="font-size: 12px; color: #22D3EE;">Cluster Size: <strong>${item.value?.toLocaleString()}</strong> airports</div>
            <div style="font-size: 12px; color: #8A97B4;">Lead Countries: <span style="color: #E6EBF5;">${countries}</span></div>
          `;
        },
      },
      series: [
        {
          name: 'Communities',
          type: 'treemap',
          data: treeData,
          leafDepth: 1,
          roam: false,
          label: {
            show: true,
            formatter: '{b}\n{c} airports',
            color: '#FFFFFF',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
          breadcrumb: { show: false },
        },
      ],
    };
  }, [treeData]);

  return (
    <ChartCard
      title="Network Communities (Louvain Modularity Treemap)"
      subtitle={insightSubtitle}
      info="Identifies tightly linked sub-networks. Area proportional to number of airports in each modular cluster."
      loading={loading}
      error={error}
      empty={!treeData.length}
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
