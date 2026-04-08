import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';

const SIZE = 140;
const CENTER = SIZE / 2;
const R = 48;
const STROKE = 16;
const CIRC = 2 * Math.PI * R;

export type DonutSegment = {
  color: string;
  share: number;
};

type SpendingDonutChartProps = {
  segments: DonutSegment[];
};

export function SpendingDonutChart({segments}: SpendingDonutChartProps) {
  const normalized = useMemo(() => {
    const sum = segments.reduce((a, s) => a + s.share, 0);
    if (sum <= 0) {
      return segments.map(s => ({...s, share: 0}));
    }
    return segments.map(s => ({...s, share: s.share / sum}));
  }, [segments]);

  const rings = useMemo(() => {
    let offset = 0;
    const nodes: React.ReactElement[] = [];
    normalized.forEach((s, i) => {
      const len = Math.max(0.0001, s.share) * CIRC;
      const dashOffset = -offset;
      offset += len;
      nodes.push(
        <Circle
          key={`seg-${i}`}
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke={s.color}
          strokeWidth={STROKE}
          strokeLinecap="butt"
          strokeDasharray={`${len} ${CIRC}`}
          strokeDashoffset={dashOffset}
        />,
      );
    });
    return nodes;
  }, [normalized]);

  return (
    <View style={styles.wrap} accessibilityRole="image" accessibilityLabel="Gráfico de gastos del mes">
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
          {rings}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
