import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenStatusBadge } from '../components/ZenStatusBadge';
import { ChartTimeline } from '../components/ChartTimeline';
import { EventChatPanel } from '../components/EventChatPanel';
import {
  IconCalendar,
  IconChart,
  IconCheck,
  IconChevron,
  IconMoney,
  IconPhotos,
  IconPin,
  IconSpark,
} from '../icons';
import { CHART_DATA, fallbackChart } from '../data/chart';
import { ScreenProps } from '../navigation/types';

type ResourceId = 'chart' | 'cal' | 'split' | 'loc' | 'pix';

export function EventDetailScreen({ navigation, route }: ScreenProps<'EventDetail'>) {
  const t = useTheme();
  const ev = route.params.event;
  const isOngoing = ev.kind === 'ongoing';
  const chart = useMemo(() => (isOngoing ? CHART_DATA[ev.id] ?? fallbackChart(ev) : null), [ev, isOngoing]);
  const [chartDone, setChartDone] = useState<boolean[]>(() =>
    chart ? chart.stages.map((s) => s.kind === 'past') : [],
  );
  const toggleStage = (i: number) =>
    setChartDone((d) => d.map((x, j) => (j === i ? !x : x)));

  const allResources: {
    id: ResourceId;
    label: string;
    meta: string;
    icon: React.ReactNode;
    onPress?: () => void;
  }[] = [
    { id: 'chart', label: 'Event planner chart', meta: '6 STAGES', icon: <IconChart color={t.fg2} />, onPress: () => navigation.navigate('PlannerChart', { event: ev }) },
    { id: 'cal', label: 'Calendar event', meta: 'GOOGLE · SYNCED', icon: <IconCalendar color={t.fg2} /> },
    { id: 'split', label: 'Payment splitter', meta: `${ev.budget} · ${ev.attendees} WAYS`, icon: <IconMoney color={t.fg2} /> },
    { id: 'loc', label: 'Linked locations', meta: 'MAPS · TFL', icon: <IconPin color={t.fg2} /> },
    { id: 'pix', label: 'Shared photo album', meta: ev.kind === 'previous' ? '42 PHOTOS' : 'OPEN', icon: <IconPhotos color={t.fg2} /> },
  ];

  const resources = isOngoing ? allResources.filter((r) => r.id !== 'chart') : allResources;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENT DETAIL" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Section paddingTop={24} gap={22}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ZenStatusBadge kind={ev.kind} />
            <ZenText
              style={{ fontFamily: FONTS.mono, fontSize: 11, color: t.fg3, letterSpacing: 1.1 }}
            >
              {ev.date.toUpperCase()}
            </ZenText>
          </View>

          <View>
            <ZenText variant="h2">{ev.title}</ZenText>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              <Meta>{ev.time}</Meta>
              <Meta>·</Meta>
              <Meta>{ev.location}</Meta>
              <Meta>·</Meta>
              <Meta>{ev.attendees} GUESTS</Meta>
            </View>
          </View>

          {/* Attendee message */}
          <View
            style={{
              borderWidth: 0.5,
              borderColor: t.hairline,
              borderRadius: RADIUS.lg,
              padding: 16,
              backgroundColor: t.surface,
            }}
          >
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 10 }}>ATTENDEE MESSAGE</ZenText>
            <ZenText style={{ color: t.fg, fontSize: 14.5, lineHeight: 21 }}>{ev.msg}</ZenText>
          </View>

          {/* Inline chart for ongoing events */}
          {isOngoing && chart ? (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <ZenText variant="eyebrow" tone="fg3">EVENT PLANNER CHART</ZenText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <IconSpark color={t.accent} />
                  <ZenText style={{ fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: 1.47, color: t.fg3 }}>
                    {String(chartDone.filter(Boolean).length).padStart(2, '0')} / {String(chart.stages.length).padStart(2, '0')} DONE
                  </ZenText>
                </View>
              </View>
              <ChartTimeline stages={chart.stages} done={chartDone} onToggle={toggleStage} />
            </View>
          ) : null}

          {/* Resources */}
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 10 }}>AUTOMATED RESOURCES</ZenText>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: t.hairline,
                borderRadius: RADIUS.lg,
                backgroundColor: t.surface,
                overflow: 'hidden',
              }}
            >
              {resources.map((r, i) => (
                <Pressable
                  key={r.id}
                  onPress={r.onPress}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: i < resources.length - 1 ? 0.5 : 0,
                    borderBottomColor: t.hairline,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: RADIUS.sm,
                      borderWidth: 0.5,
                      borderColor: t.hairline,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {r.icon}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ZenText style={{ fontSize: 15, color: t.fg }}>{r.label}</ZenText>
                    <ZenText
                      style={{ fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: 1.47, color: t.fg3 }}
                    >
                      {r.meta}
                    </ZenText>
                  </View>
                  {r.onPress ? <IconChevron color={t.fg3} /> : <IconCheck color={t.accent} />}
                </Pressable>
              ))}
            </View>
          </View>

          {/* AI chat */}
          <EventChatPanel event={ev} />
        </Section>
      </ScrollView>
    </View>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <ZenText
      style={{
        fontFamily: FONTS.mono,
        fontSize: 11,
        color: t.fg3,
        letterSpacing: 0.88,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </ZenText>
  );
}
