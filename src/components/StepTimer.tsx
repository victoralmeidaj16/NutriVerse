/**
 * StepTimer Component - Countdown timer for cooking steps
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface StepTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function StepTimer({ duration, onComplete, autoStart = false }: StepTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft, onComplete]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      // Reset
      setTimeLeft(duration);
      setIsRunning(false);
      setIsPaused(false);
    } else if (isRunning) {
      // Pause
      setIsPaused(true);
      setIsRunning(false);
    } else {
      // Resume/Start
      setIsPaused(false);
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const size = 80;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  if (duration === 0) {
    return null; // No timer needed
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerCircle}>
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
        <View style={styles.timerContent}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
        <Ionicons
          name={isRunning ? 'pause' : timeLeft === 0 ? 'refresh' : 'play'}
          size={24}
          color={colors.button}
        />
        <Text style={styles.timerButtonText}>
          {isRunning ? 'Pausar' : timeLeft === 0 ? 'Reiniciar' : isPaused ? 'Continuar' : 'Iniciar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  timerCircle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  timerButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.button,
  },
});

