import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONTS, useTheme } from '../theme';
import { ZenText } from './ZenText';
import { Stage } from '../data/chart';

const TAG_COLOR_KEYS: Record<string, 'fg' | 'fg2' | 'fg3' | 'accent'> = {
  SETUP: 'fg3',
  PRE: 'fg2',
  TRAVEL: 'fg2',
  LIVE: 'fg',
  KEY: 'accent',
  WRAP: 'fg3',
};

export function ChartTimeline({
  stages,
  done,
  onToggle,
}: {
  stages: Stage[];
  done: boolean[];
  onToggle: (i: number) => void;
}) {
  const t = useTheme();
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          left: 77.75,
          top: 8,
          bottom: 8,
          width: 0.5,
          backgroundColor: t.hairline,
        }}
      />
      {stages.map((s, i) => (
        <ChartStageRow key={i} stage={s} done={done[i]} onToggle={() => onToggle(i)} />
      ))}
    </View>
  );
}

function ChartStageRow({ stage, done, onToggle }: { stage: Stage; done: boolean; onToggle: () => void }) {
  const t = useTheme();
  const toneKey = TAG_COLOR_KEYS[stage.tag] ?? 'fg2';
  const tagColor = toneKey === 'accent' ? t.accent : toneKey === 'fg' ? t.fg : toneKey === 'fg2' ? t.fg2 : t.fg3;

  return (
    <View style={{ flexDirection: 'row', paddingBottom: 18 }}>
      <View style={{ width: 70, paddingTop: 2, paddingRight: 14, alignItems: 'flex-end' }}>
        <ZenText
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 1.2,
            color: t.fg3,
            textTransform: 'uppercase',
            lineHeight: 13,
          }}
        >
          {stage.t}
        </ZenText>
        <ZenText
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9.5,
            letterSpacing: 1.33,
            color: tagColor,
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          {stage.tag}
        </ZenText>
      </View>

      <Pressable
        onPress={onToggle}
        hitSlop={8}
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          marginTop: 4,
          marginLeft: -7.75,
          backgroundColor: done ? t.accent : t.bg,
          borderWidth: done ? 0 : 1.5,
          borderColor: tagColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {done ? (
          <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <Path d="M2 5.2l2 2 4-4.4" stroke="#0a0a0a" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </Pressable>

      <View style={{ flex: 1, marginLeft: 14, paddingLeft: 4, opacity: done ? 0.55 : 1 }}>
        <ZenText
          style={{
            fontFamily: FONTS.sansMedium,
            fontSize: 16,
            letterSpacing: -0.16,
            color: t.fg,
            lineHeight: 20,
            textDecorationLine: done ? 'line-through' : 'none',
            textDecorationColor: t.fg3,
          }}
        >
          {stage.heading}
        </ZenText>
        <ZenText style={{ marginTop: 6, fontSize: 13.5, lineHeight: 20, color: t.fg2 }}>
          {stage.body}
        </ZenText>
      </View>
    </View>
  );
}
