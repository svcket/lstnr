import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export const LineChart = ({ 
  data, 
  color = COLORS.success, 
  height = 200, 
  width = Dimensions.get('window').width 
}: LineChartProps) => { // Removed containerStyle to avoid unused variable
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const stepX = width / (data.length - 1);
  
  // Normalize Y 
  const points = data.map((val, index) => {
    const x = index * stepX;
    const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1); // 10% padding top/bottom
    return `${x},${y}`;
  });

  const d = `M ${points.join(' L ')}`;
  const fillD = `${d} L ${width},${height} L 0,${height} Z`;

  return (
    <View style={{ height, width }}>
      <Svg height={height} width={width}>
      <Svg height={height} width={width}>
        <Path // Stroke Path
          d={d}
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      </Svg>
      </Svg>
    </View>
  );
};
