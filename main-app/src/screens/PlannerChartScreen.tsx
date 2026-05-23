import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FONTS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { ChartTimeline } from '../components/ChartTimeline';
import { IconEdit, IconSpark } from '../icons';
import { CHART_DATA, fallbackChart } from '../data/chart';
import { ScreenProps } from '../navigation/types';

export function PlannerChartScreen({ navigation, route }: ScreenProps<'PlannerChart'>) {
  const t = useTheme();
  const ev = route.params.event;
  const data = useMemo(() => CHART_DATA[ev.id] ?? fallbackChart(ev), [ev]);
  const [done, setDone] = useState<boolean[]>(() => data.stages.map((s) => s.kind === 'past'));
  const toggle = (i: number) => setDone((d) => d.map((x, j) => (j === i ? !x : x)));

  const doneCount = done.filter(Boolean).length;
  const total = data.stages.length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENT PLANNER CHART" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section paddingTop={22} gap={20}>
          <View>
            <ZenText variant="eyebrow" tone="fg3">{data.sub}</ZenText>
            <ZenText variant="h2" style={{ marginTop: 4 }}>{data.title}</ZenText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <ZenText
              style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.32, color: t.fg3 }}
            >
              {String(doneCount).padStart(2, '0')} / {String(total).padStart(2, '0')} DONE
            </ZenText>
          </View>

          <ChartTimeline stages={data.stages} done={done} onToggle={toggle} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <ZenButton
              label="Regenerate"
              variant="ghost"
              leading={<IconSpark color={t.fg} />}
              style={{ flex: 1 }}
              fullWidth={false}
            />
            <ZenButton
              label="Edit chart"
              variant="ghost"
              leading={<IconEdit color={t.fg} />}
              style={{ flex: 1 }}
              fullWidth={false}
            />
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}
