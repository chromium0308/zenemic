import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useTheme } from '../theme';

export function Spinner({ size = 14, borderWidth = 1.5 }: { size?: number; borderWidth?: number }) {
  const t = useTheme();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth,
        borderColor: t.fg3Bg,
        borderTopColor: t.fg,
        transform: [{ rotate }],
      }}
    />
  );
}

export function Dot({ delay }: { delay: number }) {
  const t = useTheme();
  const op = useRef(new Animated.Value(0.2)).current;
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const make = () =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(op, { toValue: 1, duration: 440, useNativeDriver: true }),
            Animated.timing(y, { toValue: -2, duration: 440, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(op, { toValue: 0.2, duration: 660, useNativeDriver: true }),
            Animated.timing(y, { toValue: 0, duration: 660, useNativeDriver: true }),
          ]),
        ])
      );
    const loop = make();
    loop.start();
    return () => loop.stop();
  }, [delay, op, y]);

  return (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: t.fg3,
        opacity: op,
        transform: [{ translateY: y }],
      }}
    />
  );
}
