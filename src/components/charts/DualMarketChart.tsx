import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import * as d3 from "d3-scale";
import { line, area, curveMonotoneX } from "d3-shape";

export type Series = {
  key: string;      // e.g. "BED", "JIA", "YES", "NO"
  color: string;    // hex
  pct: number;      // 84
  data: number[];   // numeric series
};

type Props = {
  topSeries: Series;
  bottomSeries: Series;
  width: number;              // pass screenWidth - 32
  height?: number;            // default 320
  padding?: number;           // internal svg padding
  rightLabelWidth?: number;   // width reserved for labels on right
  showLeftPriceHints?: boolean;
  topLeftHint?: string;
  bottomLeftHint?: string;
};

export default function DualMarketChart({
  topSeries,
  bottomSeries,
  width,
  height = 320,
  padding = 12,
  rightLabelWidth = 76,
  showLeftPriceHints = true,
  topLeftHint,
  bottomLeftHint,
}: Props) {
  const innerW = width - rightLabelWidth;
  const innerH = height;

  const { topPath, bottomPath, topAreaPath, bottomAreaPath, topEnd, bottomEnd } = useMemo(() => {
    const n = Math.max(topSeries.data.length, bottomSeries.data.length);
    const xs = Array.from({ length: n }, (_, i) => i);

    const x = d3
      .scaleLinear()
      .domain([0, Math.max(0, n - 1)])
      .range([padding, innerW - padding]);

    // two “bands”
    const topBandTop = 0;
    const topBandBottom = innerH * 0.46;
    const bottomBandTop = innerH * 0.54;
    const bottomBandBottom = innerH;

    const topMin = Math.min(...topSeries.data);
    const topMax = Math.max(...topSeries.data);
    const bottomMin = Math.min(...bottomSeries.data);
    const bottomMax = Math.max(...bottomSeries.data);

    const pad = 0.0001;

    const yTop = d3
      .scaleLinear()
      .domain([0, 100])
      .range([topBandBottom - padding, topBandTop + padding]);

    const yBottom = d3
      .scaleLinear()
      .domain([0, 100])
      .range([bottomBandBottom - padding, bottomBandTop + padding]);

    const makeLine = (data: number[], yScale: any) =>
      line<number>()
        .x((_, i) => x(xs[i] ?? i))
        .y((d) => yScale(d))
        .curve(curveMonotoneX)(data as any) || "";

    const makeArea = (data: number[], yScale: any, base: number) =>
      area<number>()
        .x((_, i) => x(xs[i] ?? i))
        .y0(base)
        .y1((d) => yScale(d))
        .curve(curveMonotoneX)(data as any) || "";

    const topP = makeLine(topSeries.data, yTop);
    const bottomP = makeLine(bottomSeries.data, yBottom);

    const topA = makeArea(topSeries.data, yTop, topBandBottom);
    const bottomA = makeArea(bottomSeries.data, yBottom, bottomBandBottom);

    const topLastIdx = topSeries.data.length - 1;
    const bottomLastIdx = bottomSeries.data.length - 1;

    return {
      topPath: topP,
      bottomPath: bottomP,
      topAreaPath: topA,
      bottomAreaPath: bottomA,
      topEnd: { cx: x(topLastIdx), cy: yTop(topSeries.data[topLastIdx]) },
      bottomEnd: { cx: x(bottomLastIdx), cy: yBottom(bottomSeries.data[bottomLastIdx]) },
    };
  }, [topSeries, bottomSeries, width, height, padding, rightLabelWidth]);

  return (
    <View style={[styles.wrap, { width }]}>
      <View style={styles.svgRow}>
        <Svg width={innerW} height={innerH}>
          <Defs>
            <LinearGradient id="grad-top" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={topSeries.color} stopOpacity="0.35" />
              <Stop offset="0.6" stopColor={topSeries.color} stopOpacity="0.12" />
              <Stop offset="1" stopColor={topSeries.color} stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="grad-bottom" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={bottomSeries.color} stopOpacity="0.35" />
              <Stop offset="0.6" stopColor={bottomSeries.color} stopOpacity="0.12" />
              <Stop offset="1" stopColor={bottomSeries.color} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Top Series */}
          <Path d={topAreaPath} fill="url(#grad-top)" />
          <Path d={topPath} stroke={topSeries.color} strokeWidth={3.2} fill="none" />
          <Circle cx={topEnd.cx} cy={topEnd.cy} r={5.5} fill={topSeries.color} />

          {/* Bottom Series */}
          <Path d={bottomAreaPath} fill="url(#grad-bottom)" />
          <Path d={bottomPath} stroke={bottomSeries.color} strokeWidth={3.2} fill="none" />
          <Circle cx={bottomEnd.cx} cy={bottomEnd.cy} r={5.5} fill={bottomSeries.color} />
        </Svg>

        <View style={[styles.rightLabels, { width: rightLabelWidth, height: innerH }]}>
          <View style={[styles.labelBlock, { top: innerH * 0.18 }]}>
            <Text style={[styles.smallCode, { color: topSeries.color }]}>{topSeries.key}</Text>
            <Text style={[styles.bigPct, { color: topSeries.color }]}>{topSeries.pct}%</Text>
          </View>

          <View style={[styles.labelBlock, { top: innerH * 0.68 }]}>
            <Text style={[styles.smallCode, { color: bottomSeries.color }]}>{bottomSeries.key}</Text>
            <Text style={[styles.bigPct, { color: bottomSeries.color }]}>{bottomSeries.pct}%</Text>
          </View>
        </View>
      </View>

      {showLeftPriceHints ? (
        <View style={styles.leftHints}>
          {!!topLeftHint && <Text style={[styles.hint, { color: topSeries.color }]}>{topLeftHint}</Text>}
          {!!bottomLeftHint && (
            <Text style={[styles.hint, { color: bottomSeries.color, marginTop: 10 }]}>{bottomLeftHint}</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  svgRow: { flexDirection: "row", alignItems: "flex-start" },
  rightLabels: { position: "relative", justifyContent: "flex-start" },
  labelBlock: { position: "absolute", right: 0, alignItems: "flex-start" },
  smallCode: { fontSize: 13, fontWeight: "700", opacity: 0.8, marginBottom: -4, textAlign: 'right', width: '100%' },
  bigPct: { fontSize: 24, fontWeight: "800", lineHeight: 28, textAlign: 'right', width: '100%' },
  leftHints: { position: "absolute", left: 0, top: 88 },
  hint: { fontSize: 14, fontWeight: "700", opacity: 0.9 },
});
