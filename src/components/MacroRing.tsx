/**
 * MacroRing Component - Circular progress indicator for macros
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../theme';

interface MacroRingProps {
  size?: number;
  stroke?: number;
  progress?: number;
  label: string;
  value: string;
}

export default function MacroRing({
  size = 92,
  stroke = 10,
  progress = 0.7,
  label,
  value,
}: MacroRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = useMemo(() => circumference * (1 - progress), [progress, circumference]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashoffset}
          fill="none"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <Text style={[styles.value, { top: size / 2 - 10 }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  value: {
    position: 'absolute',
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    fontSize: 14,
  },
  label: {
    marginTop: 6,
    ...typography.styles.small,
    color: colors.text.quaternary,
  },
});

