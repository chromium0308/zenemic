import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { ZenText } from './ZenText';
import type { EventKind } from '../data/events';

const LABEL: Record<EventKind, string> = {
  planned: 'Planned',
  ongoing: 'Ongoing',
  previous: 'Previous',
};

export function ZenStatusBadge({ kind }: { kind: EventKind }) {
  const t = useTheme();
  const dotColor = kind === 'planned' ? t.accent : kind === 'ongoing' ? t.green : t.fg3;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 3.5,
          backgroundColor: dotColor,
        }}
      />
      <ZenText variant="mark" tone="fg2">{LABEL[kind]}</ZenText>
    </View>
  );
}
