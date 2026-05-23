import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

export function Section({
  children,
  style,
  gap = 16,
  paddingTop = 24,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
  paddingTop?: number;
}) {
  return (
    <View style={[{ paddingHorizontal: 24, paddingTop, paddingBottom: 24, gap }, style]}>
      {children}
    </View>
  );
}

export function Anchor({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, gap: 10 }, style]}>
      {children}
    </View>
  );
}
