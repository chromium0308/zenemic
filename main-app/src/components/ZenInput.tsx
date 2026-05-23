import React, { useState } from 'react';
import { TextInput, TextInputProps, View, ViewStyle, StyleProp } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenText } from './ZenText';

export interface ZenInputProps extends TextInputProps {
  label?: string;
  labelTone?: 'fg' | 'fg2' | 'fg3' | 'accent';
  labelSuffix?: string;
  errorBorder?: boolean;
  okBorder?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
}

export function ZenInput({
  label,
  labelTone,
  labelSuffix,
  errorBorder,
  okBorder,
  containerStyle,
  multiline,
  style,
  ...rest
}: ZenInputProps) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = errorBorder
    ? t.accent
    : okBorder
    ? t.fg2
    : focused
    ? t.fg2
    : t.hairline;

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label ? (
        <ZenText variant="label" tone={labelTone ?? 'fg3'}>
          {label}{labelSuffix ? ` ${labelSuffix}` : ''}
        </ZenText>
      ) : null}
      <TextInput
        placeholderTextColor={t.fg3}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          {
            backgroundColor: t.surface,
            borderWidth: 0.5,
            borderColor,
            borderRadius: RADIUS.md,
            paddingHorizontal: 14,
            paddingVertical: 14,
            fontFamily: FONTS.sans,
            fontSize: 15,
            color: t.fg,
            minHeight: multiline ? 160 : undefined,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}
