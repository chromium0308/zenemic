import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { Spinner } from '../components/Spinner';
import { IconCheck } from '../icons';
import { ScreenProps } from '../navigation/types';

const TASKS = [
  { id: 't1', label: 'Create event planner chart' },
  { id: 't2', label: 'Create calendar event' },
  { id: 't3', label: 'Build payment splitter' },
  { id: 't4', label: 'Link locations · Maps + TfL' },
  { id: 't5', label: 'Open shared photo album' },
  { id: 't6', label: 'Create event in system' },
  { id: 't7', label: 'Store to database' },
];

type State = 'done' | 'running' | 'pending';

export function CreateProcessingScreen({ navigation }: ScreenProps<'CreateProcessing'>) {
  const t = useTheme();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done < TASKS.length) {
      const id = setTimeout(() => setDone((d) => d + 1), 540);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => navigation.replace('CreateSuccess'), 600);
    return () => clearTimeout(id);
  }, [done, navigation]);

  const renderBox = (slice: typeof TASKS, offset: number) => (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: t.hairline,
        borderRadius: RADIUS.lg,
        backgroundColor: t.surface,
        overflow: 'hidden',
      }}
    >
      {slice.map((task, i) => {
        const idx = i + offset;
        const state: State = idx < done ? 'done' : idx === done ? 'running' : 'pending';
        return (
          <View
            key={task.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: i < slice.length - 1 ? 0.5 : 0,
              borderBottomColor: t.hairline,
              opacity: state === 'pending' ? 0.4 : 1,
            }}
          >
            <ProcessIcon state={state} />
            <ZenText style={{ flex: 1, fontSize: 15, color: t.fg }}>{task.label}</ZenText>
            <ZenText
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                letterSpacing: 1.6,
                textTransform: 'uppercase',
                color: state === 'done' ? t.accent : t.fg3,
              }}
            >
              {state === 'done' ? 'DONE' : state === 'running' ? 'RUNNING' : '·'}
            </ZenText>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENT.CREATE" progress={3} total={4} showMenu={false} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section paddingTop={28} gap={24}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>PROCESSING · 03 / 04</ZenText>
            <ZenText variant="h1">Setting up{'\n'}your event…</ZenText>
          </View>

          <View style={{ gap: 8 }}>
            <ZenText variant="eyebrow" tone="fg3">AUTOMATED RESOURCES</ZenText>
            {renderBox(TASKS.slice(0, 5), 0)}
          </View>

          <View style={{ gap: 8 }}>
            <ZenText variant="eyebrow" tone="fg3">SYSTEM</ZenText>
            {renderBox(TASKS.slice(5), 5)}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function ProcessIcon({ state }: { state: State }) {
  const t = useTheme();
  if (state === 'done') {
    return (
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck color="#0a0a0a" />
      </View>
    );
  }
  if (state === 'running') {
    return (
      <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 0.5,
        borderColor: t.hairline,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: t.fg3 }} />
    </View>
  );
}
