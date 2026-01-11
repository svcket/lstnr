import React, { useRef, useState } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  onScrub?: (value: number | null) => void;
}

export const LineChart = ({ 
  data, 
  color = COLORS.success, 
  height = 200, 
  width = Dimensions.get('window').width,
  onScrub
}: LineChartProps) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const stepX = width / (data.length - 1);
  
  // Normalize Y 
  const points = data.map((val, index) => {
    const x = index * stepX;
    const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1); 
    return {x, y, val};
  });

  const d = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  const [scrubX, setScrubX] = useState<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      
      onPanResponderGrant: (evt) => {
        handleTouch(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        handleTouch(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: () => {
        setScrubX(null);
        if (onScrub) onScrub(null);
      },
      onPanResponderTerminate: () => {
        setScrubX(null);
        if (onScrub) onScrub(null);
      },
    })
  ).current;

  const handleTouch = (x: number) => {
      // Find closest point
      const index = Math.round(x / stepX);
      if (index >= 0 && index < points.length) {
          setScrubX(points[index].x);
          if (onScrub) onScrub(points[index].val);
      }
  };

  return (
    <View style={{ height, width }} {...(onScrub ? panResponder.panHandlers : {})}>
      <Svg height={height} width={width}>
        <Path 
          d={d}
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
        {/* Scrub Line and Dot */}
        {scrubX !== null && (
            <>
                <Line
                    x1={scrubX}
                    y1={0}
                    x2={scrubX}
                    y2={height}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity={0.5}
                />
                <Circle 
                    cx={scrubX}
                    cy={points.find(p => Math.abs(p.x - scrubX) < 0.1)?.y || 0}
                    r={6}
                    fill="#FFF"
                />
            </>
        )}
      </Svg>
    </View>
  );
};
