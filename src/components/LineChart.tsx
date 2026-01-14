import React, { useRef, useState } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/theme';

export interface ChartSeries {
  data: number[];
  color: string;
  strokeWidth?: number;
  opacity?: number;
}

interface LineChartProps {
  data: number[] | ChartSeries[]; // Support legacy single array or new series array
  color?: string; // Legacy fallback
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
  // Normalize input to Series format
  const series: ChartSeries[] = Array.isArray(data) && typeof data[0] === 'number' 
    ? [{ data: data as number[], color }] 
    : (data as ChartSeries[]);

  if (series.length === 0 || series[0].data.length < 2) return null;

  // Calculate Global Min/Max across all series
  const allValues = series.flatMap(s => s.data);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1; // Avoid divide by zero
  
  const stepX = width / (series[0].data.length - 1);
  
  // Normalize Y for a specific series
  const getPoints = (dataset: number[]) => {
      return dataset.map((val, index) => {
          const x = index * stepX;
          const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1); 
          return {x, y, val};
      });
  };

  const [scrubX, setScrubX] = useState<number | null>(null);

  // Generate paths for all series
  const paths = series.map(s => {
      const points = getPoints(s.data);
      const d = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
      return { d, color: s.color, points, strokeWidth: s.strokeWidth || 3, opacity: s.opacity ?? 1 };
  });

  const handleTouch = (x: number) => {
      // Find closest point index
      const index = Math.round(x / stepX);
      const primaryPoints = paths[0].points; // Use first series for X-axis sync
      
      if (index >= 0 && index < primaryPoints.length) {
          setScrubX(primaryPoints[index].x);
          // Return the value of the primary series (usually 'Yes' or top outcome)
          if (onScrub) onScrub(primaryPoints[index].val);
      }
  };

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

  return (
    <View style={{ height, width }} {...(onScrub ? panResponder.panHandlers : {})}>
      <Svg height={height} width={width}>
        <Defs>
          {paths.map((p, i) => (
            <LinearGradient key={`grad-${i}`} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={p.color} stopOpacity={0.25 * p.opacity} />
              <Stop offset="1" stopColor={p.color} stopOpacity="0" />
            </LinearGradient>
          ))}
        </Defs>

        {paths.map((p, i) => {
            // Create closed path for fill
            const fillD = `${p.d} L ${width},${height} L 0,${height} Z`;
            return (
                <React.Fragment key={i}>
                    {/* Only fill if opacity is high enough to matter, otherwise skip for performance/cleanliness */}
                    {p.opacity > 0.1 && (
                        <Path
                            d={fillD}
                            fill={`url(#gradient-${i})`}
                        />
                    )}
                    <Path 
                        d={p.d}
                        stroke={p.color}
                        strokeWidth={p.strokeWidth}
                        strokeOpacity={p.opacity}
                        fill="none"
                    />
                </React.Fragment>
            );
        })}
        
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
                {paths.map((p, i) => {
                    // Only show dot for primary (first) series or opaque series
                    if (i > 0 && p.opacity < 0.5) return null;
                    
                    const point = p.points.find(pt => Math.abs(pt.x - scrubX) < 1.0); 
                    if (!point) return null;
                    return (
                        <Circle 
                            key={`dot-${i}`}
                            cx={scrubX}
                            cy={point.y}
                            r={6}
                            fill="#FFF"
                            opacity={p.opacity}
                        />
                    );
                })}
            </>
        )}
      </Svg>
    </View>
  );
};
