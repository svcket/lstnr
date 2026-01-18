import React, { useRef, useState, useMemo } from 'react';
import { View, Dimensions, PanResponder, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Data Types
export interface ChartSeries {
  data: number[];
  color: string;
  label?: string; // For legend/scrubbing
  strokeWidth?: number;
  opacity?: number;
  isActive?: boolean; // If true, rendering priority (z-index equivalent) is higher
}

export type ChartMode = 'SINGLE' | 'DUAL' | 'MULTI';

interface UnifiedMarketChartProps {
  series: ChartSeries[];
  mode: ChartMode;
  height?: number;
  width?: number; // Defaults to SCREEN_WIDTH (full width)
  onScrub?: (value: number | null, seriesIndex?: number) => void;
  // Timeframe props
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  scrubX?: number | null;
  onScrubChange?: (val: number | null) => void;
  onScrubIndex?: (index: number | null) => void;
}

const DEFAULT_TIMEFRAMES = ['1D', '1W', '1M', 'ALL'];


export const UnifiedMarketChart = (props: UnifiedMarketChartProps) => {
  const { 
      series, 
      mode,
      height = 220, 
      width = SCREEN_WIDTH,
      onScrub,
      timeframes = DEFAULT_TIMEFRAMES,
      activeTimeframe,
      onTimeframeChange
  } = props;

  // Filter out empty series
  const validSeries = useMemo(() => series.filter(s => s.data && s.data.length > 1), [series]);
  
  // Calculate Global Min/Max to scale all lines together (essential for comparison)
  const { min, max, range, stepX } = useMemo(() => {
     if (validSeries.length === 0) return { min: 0, max: 100, range: 100, stepX: 0 };
     
     const allValues = validSeries.flatMap(s => s.data);
     const minVal = Math.min(...allValues);
     const maxVal = Math.max(...allValues);
     // Add some padding to range so lines don't hug exact top/bottom tightly if flat
     const r = (maxVal - minVal) || 1; 
     
     // Assume uniform X steps for now based on the first series length
     const sX = width / (validSeries[0].data.length - 1);
     
     return { min: minVal, max: maxVal, range: r, stepX: sX };
  }, [validSeries, width]);

  // Normalize Y
  const getPoints = (dataset: number[]) => {
      // Mapping value to Y coordinate
      // Y = 0 is top, Y = height is bottom.
      // We want high values at top.
      return dataset.map((val, index) => {
          const x = index * stepX;
          // Scale to 80% height, centered vertically roughly
          const y = height - ((val - min) / range) * (height * 0.7) - (height * 0.15); 
          return {x, y, val};
      });
  };

  const [scrubX, setScrubX] = useState<number | null>(null);

  // Generate paths
  const paths = useMemo(() => {
      return validSeries.map((s, i) => {
          const points = getPoints(s.data);
          const d = `M ${points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
          return { 
              ...s, 
              d, 
              points,
              // Default styling if not provided
              strokeWidth: s.strokeWidth ?? (mode === 'SINGLE' ? 2 : 3),
              opacity: s.opacity ?? 1,
              color: s.color, 
              index: i
          };
      });
  }, [validSeries, min, range, stepX, height, mode]);

  // Touch Handling
  const handleTouch = (x: number) => {
      if (validSeries.length === 0) return;
      
      const index = Math.round(x / stepX);
      const primaryPoints = paths[0].points; 
      
      if (index >= 0 && index < primaryPoints.length) {
          const snappedX = primaryPoints[index].x;
          setScrubX(snappedX);
          
          if (onScrub) {
              // For Dual/Multi, we might want to pass back values for ALL series, 
              // but standard scrubbing usually follows the "primary" or active one.
              // Logic: Find the value for the 'active' series if defined, else first.
              const activePath = paths.find(p => p.isActive) || paths[0];
              onScrub(activePath.points[index].val, activePath.index);
          }
          if (props.onScrubIndex) {
              props.onScrubIndex(index);
          }
      }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderRelease: () => {
        setScrubX(null);
        if (onScrub) onScrub(null);
        if (props.onScrubIndex) props.onScrubIndex(null);
      },
      onPanResponderTerminate: () => {
        setScrubX(null);
        if (onScrub) onScrub(null);
        if (props.onScrubIndex) props.onScrubIndex(null);
      },
    })
  ).current;

  if (validSeries.length === 0) return null;

  return (
    <View>
        <View style={{ height, width }} {...(onScrub ? panResponder.panHandlers : {})}>
            <Svg height={height} width={width}>
                <Defs>
                    {paths.map((p, i) => (
                        <LinearGradient key={`grad-${i}`} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={p.color} stopOpacity={0.2 * (p.opacity || 1)} />
                            <Stop offset="1" stopColor={p.color} stopOpacity="0" />
                        </LinearGradient>
                    ))}
                </Defs>

                {/* Render Inactive (Background) Series First */}
                {paths.filter(p => !p.isActive).map((p, i) => (
                    <RenderPath key={`inactive-${i}`} path={p} width={width} height={height} mode={mode} />
                ))}

                {/* Render Active Series Last (On Top) */}
                {paths.filter(p => p.isActive).map((p, i) => (
                    <RenderPath key={`active-${i}`} path={p} width={width} height={height} mode={mode} />
                ))}

                {/* Scrub Line & Dots */}
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
                            // Don't show dot if series is very faint
                            if ((p.opacity || 1) < 0.3) return null;

                            const point = p.points.find(pt => Math.abs(pt.x - scrubX) < 1.0);
                            if (!point) return null;
                            
                            return (
                                <Circle 
                                    key={`dot-${i}`}
                                    cx={scrubX}
                                    cy={point.y}
                                    r={p.isActive ? 6 : 4}
                                    fill={COLORS.white}
                                    opacity={p.opacity}
                                />
                            );
                        })}
                    </>
                )}
                
                {/* Endpoint Dots (When NOT scrubbing) */}
                {scrubX === null && paths.map((p, i) => {
                     // Only show for reasonably visible lines
                     if ((p.opacity || 1) < 0.4) return null;
                     
                     const lastPoint = p.points[p.points.length - 1];
                     return (
                        <Circle 
                            key={`end-dot-${i}`}
                            cx={lastPoint.x}
                            cy={lastPoint.y}
                            r={p.isActive ? 4 : 3}
                            fill={p.color}
                        />
                     );
                })}
            </Svg>
            
            {/* DUAL MODE: Right-side Labels for Endpoints (HTML Overlay mostly for cleaner text rendering) */}
            {mode === 'DUAL' && scrubX === null && (
                <View style={[styles.rightLabelsOverlay, { height, width }]}>
                    {paths.map((p, i) => {
                        if ((p.opacity || 1) < 0.4) return null;
                        const lastPoint = p.points[p.points.length - 1];
                        // Don't render if it's too close to right edge to prevent clipping? 
                        // Actually design requests "big % labels at right".
                        // We'll position absolute.
                        return (
                            <View 
                                key={`label-${i}`} 
                                style={{ 
                                    position: 'absolute', 
                                    left: width - 40, // Fixed right sidebar area
                                    top: lastPoint.y - 10 
                                }}
                            >
                                <Text style={[styles.rightLabel, { color: p.color }]}>
                                    {Math.round(lastPoint.val)}%
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>

        {/* Timeframe Pills */}
        {timeframes && timeframes.length > 0 && (
            <View style={styles.timeframeRow}>
                {timeframes.map((tf) => (
                    <TouchableOpacity
                        key={tf}
                        style={[styles.tfPill, activeTimeframe === tf && styles.tfPillActive]}
                        onPress={() => onTimeframeChange && onTimeframeChange(tf)}
                    >
                        <Text style={[styles.tfText, activeTimeframe === tf && styles.tfTextActive]}>{tf}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}
    </View>
  );
};

const RenderPath = ({ path, width, height, mode }: { path: any; width: number; height: number; mode: ChartMode }) => {
    // Fill Logic: 
    // Single: Always fill.
    // Dual/Multi: Fill only if opacity > 0.1 (to avoid mud), basically active ones.
    const showFill = mode === 'SINGLE' || (path.opacity || 0) > 0.1;

    const fillD = `${path.d} L ${width},${height} L 0,${height} Z`;
    
    return (
        <React.Fragment>
            {showFill && (
                <Path
                    d={fillD}
                    fill={`url(#gradient-${path.index})`}
                />
            )}
            <Path 
                d={path.d}
                stroke={path.color}
                strokeWidth={path.strokeWidth}
                strokeOpacity={path.opacity}
                fill="none"
            />
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    timeframeRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 8,
        paddingHorizontal: 0, // Container handles external padding usually, but chart might be full width
        justifyContent: 'flex-start',
    },
    tfPill: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tfPillActive: {
        backgroundColor: '#181818',
    },
    tfText: {
        fontFamily: FONT_FAMILY.header,
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    tfTextActive: {
        color: '#FFF',
    },
    rightLabelsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none', // Allow touch through
    },
    rightLabel: {
        fontSize: 12,
        fontWeight: '700',
        fontFamily: FONT_FAMILY.balance,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    }
});
