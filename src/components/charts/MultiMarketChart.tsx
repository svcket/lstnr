import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import * as d3 from 'd3-shape';
import * as d3Scale from 'd3-scale';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChartSeries {
  data: number[];
  color: string;
  name: string;
  isActive?: boolean;
}

interface MultiMarketChartProps {
  series: ChartSeries[];
  width?: number;
  height?: number;
  showLabels?: boolean;
}

const MultiMarketChart = ({ 
  series, 
  width = SCREEN_WIDTH - 32, 
  height = 220,
  showLabels = true
}: MultiMarketChartProps) => {

  const { paths, endPoints, yScale } = useMemo(() => {
    if (!series || series.length === 0) return { paths: [], endPoints: [], yScale: null };

    // 1. Scales
    // X Scale: simple index based
    const dataLength = series[0].data.length;
    const xScale = d3Scale.scaleLinear()
      .domain([0, dataLength - 1])
      .range([0, width]);

    // Y Scale: Fixed 0-100
    // Padding top/bottom for visuals
    const padding = 10;
    const effectiveHeight = height - 2 * padding;
    
    // Invert Y range for SVG (0 is top)
    const yScale = d3Scale.scaleLinear()
      .domain([0, 100])
      .range([height - padding, padding]);

    // 2. Line Generator
    const lineGen = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX); // Smooth curve

    // 3. Generate Paths & Endpoints
    const results = series.map(s => {
      const path = lineGen(s.data) || '';
      const lastValue = s.data[s.data.length - 1];
      const endX = xScale(s.data.length - 1);
      const endY = yScale(lastValue);

      return {
        path,
        color: s.color,
        endPoint: { x: endX, y: endY, value: lastValue },
        name: s.name,
        isActive: s.isActive ?? true
      };
    });

    return { paths: results, endPoints: results.map(r => r.endPoint), yScale };

  }, [series, width, height]);

  if (!yScale) return null;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Draw Lines */}
        {paths.map((p, i) => (
          <Path
            key={`line-${i}`}
            d={p.path}
            stroke={p.color}
            strokeWidth={3}
            strokeOpacity={p.isActive ? 1 : 0.4}
            fill="none"
          />
        ))}

        {/* Draw End Dots */}
        {paths.map((p, i) => (
            p.isActive && (
                <Circle
                    key={`dot-${i}`}
                    cx={p.endPoint.x}
                    cy={p.endPoint.y}
                    r={5}
                    fill={p.color}
                    stroke="#000"
                    strokeWidth={2}
                />
            )
        ))}
      </Svg>

       {/* Right Side Labels (Optional - can be cluttered for multi-range) */}
       {/* If we have many lines, better to show legends outside OR just show top moving ones. 
           For now, skipping in-chart labels to avoid overlap or clutter, user can rely on header legend. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MultiMarketChart;
