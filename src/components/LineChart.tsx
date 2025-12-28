import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
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

  return (
    <View style={{ height, width }}>
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.5" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path
          d={d}
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
        {/* Fill area below logic omitted for simplicity, just line for now */}
      </Svg>
    </View>
  );
};
