import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconBack } from '../icons';
import { useTheme } from '../theme';
import { ZenText } from './ZenText';

export interface ZenChromeProps {
  label: string;
  onBack?: () => void;
  progress?: number;
  total?: number;
  showMenu?: boolean;
  onMenu?: () => void;
  hideBottomBorder?: boolean;
  centered?: boolean;
}

export function ZenChrome({
  label,
  onBack,
  progress,
  total,
  showMenu = true,
  onMenu,
  hideBottomBorder,
  centered,
}: ZenChromeProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, 28) + 12;

  return (
    <View
      style={{
        paddingTop: topPad,
        paddingHorizontal: 24,
        paddingBottom: 18,
        borderBottomWidth: hideBottomBorder ? 0 : 0.5,
        borderBottomColor: t.hairline,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={10}>
            <IconBack color={t.fg2} />
          </Pressable>
        ) : null}
        <ZenText variant="mark" tone="fg">{label}</ZenText>
      </View>
      {!centered ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {progress != null && total != null ? (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 22,
                    height: 3,
                    borderRadius: 999,
                    backgroundColor: i < progress ? t.fg : t.fg3Bg,
                  }}
                />
              ))}
            </View>
          ) : null}
          {showMenu ? (
            <Pressable onPress={onMenu} hitSlop={10} style={{ width: 22, height: 22, justifyContent: 'center', gap: 4 }}>
              <View style={{ width: 22, height: 1.5, backgroundColor: t.fg }} />
              <View style={{ width: 22, height: 1.5, backgroundColor: t.fg }} />
              <View style={{ width: 22, height: 1.5, backgroundColor: t.fg }} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function ZenBrandBar() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 28) + 12,
        paddingBottom: 18,
        alignItems: 'center',
      }}
    >
      <ZenText variant="wordmark" tone="fg">ZENEMIC</ZenText>
    </View>
  );
}
