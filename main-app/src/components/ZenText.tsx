import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { FONTS, useTheme } from '../theme';

type Variant = 'h1' | 'h2' | 'body' | 'muted' | 'eyebrow' | 'label' | 'mark' | 'wordmark' | 'wordmarkBig' | 'meta';

const VARIANT_STYLES: Record<Variant, TextStyle> = {
  h1: { fontFamily: FONTS.sansSemibold, fontSize: 30, letterSpacing: -0.6, lineHeight: 34 },
  h2: { fontFamily: FONTS.sansSemibold, fontSize: 22, letterSpacing: -0.33, lineHeight: 26 },
  body: { fontFamily: FONTS.sans, fontSize: 15, lineHeight: 22 },
  muted: { fontFamily: FONTS.sans, fontSize: 15, lineHeight: 22 },
  eyebrow: { fontFamily: FONTS.monoMedium, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  label: { fontFamily: FONTS.monoMedium, fontSize: 10.5, letterSpacing: 1.7, textTransform: 'uppercase' },
  mark: { fontFamily: FONTS.monoMedium, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  wordmark: { fontFamily: FONTS.monoSemibold, fontSize: 13, letterSpacing: 4.16, textTransform: 'uppercase' },
  wordmarkBig: { fontFamily: FONTS.monoMedium, fontSize: 22, letterSpacing: 7.04, textTransform: 'uppercase' },
  meta: { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' },
};

export interface ZenTextProps extends TextProps {
  variant?: Variant;
  tone?: 'fg' | 'fg2' | 'fg3' | 'accent' | 'green' | 'bg';
}

export function ZenText({ variant = 'body', tone, style, ...rest }: ZenTextProps) {
  const t = useTheme();
  const colorMap = {
    fg: t.fg,
    fg2: t.fg2,
    fg3: t.fg3,
    accent: t.accent,
    green: t.green,
    bg: t.bg,
  };
  const defaultTone: ZenTextProps['tone'] =
    variant === 'eyebrow' || variant === 'label' || variant === 'meta' ? 'fg3' :
    variant === 'mark' ? 'fg2' :
    variant === 'body' || variant === 'muted' ? 'fg2' :
    'fg';
  const color = colorMap[tone ?? defaultTone];
  return <Text {...rest} style={[VARIANT_STYLES[variant], { color }, style]} />;
}
