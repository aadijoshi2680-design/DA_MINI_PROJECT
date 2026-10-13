import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '../ui/ChartCard';
import { baseEchartsTheme, THEME_COLORS } from '../../config/theme';

/**
 * Chart 4: Airline Geographic Reach (Countries vs Airports Served)
 * Grouped dual bar comparing sovereign countries reached and total airports
 */
export default function AirlineReachChart({ data = [], loading = false, error = null, onAirlineClick }) {
  const topReachAirlines = useMemo(() => {
    return [...data]
      .filter((a) => a.active && typeof a.countryCount === 'number')
      .sort((a, b) => (b.countryCount || 0) - (a.countryCount || 0))
      .slice(0, 10);
  }, [data]);

  const insightSubtitle = useMemo(() => {
    return 'Turkish Airlines, Emirates and Lufthansa lead in international sovereign breadth';
  }, []);

  const option = useMemo(() => {
    const categories = topReachAirlines.map((a) => a.name.split(' ')[0]);
    const countriesData = topReachAirlines.map((a) => a.countryCount || 0);
    const airportsData = topReachAirlines.map((a) => a.airportCount || 0);

    return {
      ...baseEchartsTheme,
      tooltip: {
        ...baseEchartsTheme.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const idx = params[0].dataIndex;
          const a = topReachAirlines[idx];
          if (!a) return '';
          return `
            <div style="font-weight: 600; color: #E6EBF5;">${a.name} (${a.iata || a.key})</div>
            <div style="font-size: 12px; color: #8A97B4;">Country of Origin: <span style="color: #E6EBF5;">${a.country}</span></div>
            <div style="font-size: 12px; color: #8A97B4;">Countries Reached: <strong style="color: #22D3EE;">${a.countryCount}</strong></div>
            <div style="font-size: 12px; color: #8A97B4;">Airports Served: <strong style="color: #8B5CF6;">${a.airportCount}</strong></div>
          `;
        },
      },
      legend: {
        data: ['Countries Reached', 'Airports Served'],
        textStyle: { color: THEME_COLORS.textMuted, fontSize: 11 },
        top: 0,
        right: 10,
      },
      grid: {
        ...baseEchartsTheme.grid,
        left: 45,
        right: 20,
        top: 40,
        bottom: 50,
      },
      xAxis: {
        ...baseEchartsTheme.xAxis,
        type: 'category',
        data: categories,
        axisLabel: {
          color: THEME_COLORS.text,
          fontSize: 11,
          rotate: 25,
        },
      },
      yAxis: {
        ...baseEchartsTheme.yAxis,
        type: 'value',
      },
      series: [
        {
          name: 'Countries Reached',
          type: 'bar',
          data: countriesData,
          barWidth: 10,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: '#22D3EE',
          },
        },
        {
          name: 'Airports Served',
          type: 'bar',
          data: airportsData,
          barWidth: 10,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: '#8B5CF6',
          },
        },
      ],
    };
  }, [topReachAirlines]);

  const onEvents = useMemo(() => ({
    click: (params) => {
      const selected = topReachAirlines[params.dataIndex];
      if (selected && onAirlineClick) {
        onAirlineClick(selected);
      }
    },
  }), [topReachAirlines, onAirlineClick]);

  return (
    <ChartCard
      title="Airline Geographic Reach (Sovereign Countries vs Airports)"
      subtitle={insightSubtitle}
      info="Measures distinct sovereign countries and destination airports connected by carrier."
      loading={loading}
      error={error}
      empty={!topReachAirlines.length}
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
