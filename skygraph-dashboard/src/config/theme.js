/**
 * SkyGraph Design Tokens & Shared ECharts Theme
 * Source of truth: design.md
 */

export const THEME_COLORS = {
  bg: '#070B14',
  bgElev: '#0E1525',
  bgElev2: '#141D33',
  border: '#1F2A44',
  text: '#E6EBF5',
  textMuted: '#8A97B4',
  primary: '#22D3EE',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  success: '#34D399',
  danger: '#F87171',
};

// Colorblind-friendly chart palette (order from design.md)
export const CHART_PALETTE = [
  '#22D3EE', // Cyan
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#34D399', // Emerald
  '#F472B6', // Pink
  '#60A5FA', // Blue
  '#FB923C', // Orange
  '#A3E635', // Lime
];

/**
 * Shared base ECharts option configuration
 */
export const baseEchartsTheme = {
  backgroundColor: 'transparent',
  color: CHART_PALETTE,
  animationDuration: 800,
  animationEasing: 'cubicOut',
  textStyle: {
    fontFamily: 'Inter, sans-serif',
    color: THEME_COLORS.textMuted,
  },
  title: {
    textStyle: {
      color: THEME_COLORS.text,
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 600,
      fontSize: 16,
    },
    subtextStyle: {
      color: THEME_COLORS.textMuted,
      fontSize: 13,
    },
  },
  grid: {
    containLabel: true,
    top: 40,
    bottom: 24,
    left: 20,
    right: 20,
  },
  tooltip: {
    backgroundColor: '#0E1525',
    borderColor: '#1F2A44',
    borderWidth: 1,
    padding: [10, 14],
    borderRadius: 8,
    textStyle: {
      color: THEME_COLORS.text,
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
    },
    extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);',
  },
  xAxis: {
    axisLine: { lineStyle: { color: '#1F2A44' } },
    axisTick: { show: false },
    axisLabel: { color: THEME_COLORS.textMuted, fontSize: 12 },
    splitLine: { lineStyle: { color: 'rgba(31, 42, 68, 0.6)' } },
  },
  yAxis: {
    axisLine: { lineStyle: { color: '#1F2A44' } },
    axisTick: { show: false },
    axisLabel: { color: THEME_COLORS.textMuted, fontSize: 12 },
    splitLine: { lineStyle: { color: 'rgba(31, 42, 68, 0.6)' } },
  },
};
