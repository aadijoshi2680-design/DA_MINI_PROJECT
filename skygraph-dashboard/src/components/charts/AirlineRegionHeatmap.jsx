import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 12: Airline x Region Heatmap Matrix
 * 2D Heatmap depicting routes operated per carrier across world continents
 */
export default function AirlineRegionHeatmap({ data, loading = false, error = null }) {
  const airlines = data?.airlines || [];
  const regions = data?.regions || [];
  const values = data?.values || [];

  const insightSubtitle = useMemo(() => {
    return 'European and North American carriers operate heavy domestic loops with targeted transoceanic corridors';
  }, []);

  const heatmapPoints = useMemo(() => {
    const points = [];
    let max = 1;

    for (let r = 0; r < values.length; r++) {
      for (let c = 0; c < (values[r] || []).length; c++) {
        const val = values[r][c];
        if (val > max) max = val;
        points.push([c, r, val]);
      }
    }

    return { points, max };
  }, [values]);

  const option = useMemo(() => {
    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        position: 'top',
        formatter: (params) => {
          const [c, r, val] = params.value;
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${airlines[r]}</div>
            <div style="font-size: 12px; color: #8A97B4;">Region: <span style="color: #E6EBF5;">${regions[c]}</span></div>
            <div style="font-size: 13px; color: #22D3EE;">Routes: <strong>${val.toLocaleString()}</strong></div>
          `;
        },
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 140,
        right: 40,
        top: 20,
        bottom: 50,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'category',
        data: regions,
        splitArea: { show: true },
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
          rotate: 20,
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'category',
        data: airlines,
        splitArea: { show: true },
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
        },
      },
      visualMap: {
        min: 0,
        max: heatmapPoints.max || 2000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
          color: ['#0E1525', '#14274E', '#22D3EE', '#F59E0B'],
        },
        textStyle: { color: THEME_COLORS.textMuted, fontSize: 10 },
      },
      series: [
        {
          name: 'Routes in Region',
          type: 'heatmap',
          data: heatmapPoints.points,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(34, 211, 238, 0.5)',
            },
          },
        },
      ],
    };
  }, [airlines, regions, heatmapPoints]);

  return (
    <ChartCard
      title="Airline × Region Market Matrix"
      subtitle={insightSubtitle}
      info="Cross-tabulation matrix correlating carrier flight networks across global continental regions."
      loading={loading}
      error={error}
      empty={!airlines.length}
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
