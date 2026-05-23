import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { ZenText } from '../components/ZenText';
import { ZenStatusBadge } from '../components/ZenStatusBadge';
import { IconArchive, IconChevron, IconClock, IconPlay, IconPlus } from '../icons';
import { EVENTS, EventKind } from '../data/events';
import { ScreenProps } from '../navigation/types';

const TABS: { id: EventKind; label: string; icon: (color: string) => React.ReactNode }[] = [
  { id: 'planned', label: 'Planned', icon: (c) => <IconClock color={c} /> },
  { id: 'ongoing', label: 'Ongoing', icon: (c) => <IconPlay color={c} /> },
  { id: 'previous', label: 'Previous', icon: (c) => <IconArchive color={c} /> },
];

export function EventsListScreen({ navigation }: ScreenProps<'Events'>) {
  const t = useTheme();
  const [tab, setTab] = useState<EventKind>('planned');
  const filtered = EVENTS.filter((e) => e.kind === tab);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENTS" onMenu={() => navigation.navigate('Settings')} />
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, borderBottomWidth: 0.5, borderBottomColor: t.hairline }}>
        {TABS.map((tabSpec) => {
          const active = tab === tabSpec.id;
          const color = active ? t.fg : t.fg3;
          return (
            <Pressable
              key={tabSpec.id}
              onPress={() => setTab(tabSpec.id)}
              style={{
                flex: 1,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                borderBottomWidth: 1.5,
                borderBottomColor: active ? t.accent : 'transparent',
              }}
            >
              {tabSpec.icon(color)}
              <ZenText style={{ fontFamily: FONTS.monoMedium, fontSize: 11, letterSpacing: 1.7, textTransform: 'uppercase', color }}>
                {tabSpec.label}
              </ZenText>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120, gap: 10 }}>
        {filtered.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 8 }}>NO EVENTS</ZenText>
            <ZenText variant="body">Nothing here yet. Tap + to create your first event.</ZenText>
          </View>
        ) : null}

        {filtered.map((ev) => (
          <Pressable
            key={ev.id}
            onPress={() => navigation.navigate('EventDetail', { event: ev })}
            style={({ pressed }) => ({
              backgroundColor: pressed ? t.surface2 : t.surface,
              borderWidth: 0.5,
              borderColor: t.hairline,
              borderRadius: RADIUS.md,
              paddingVertical: 16,
              paddingHorizontal: 18,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            })}
          >
            <View style={{ flex: 1 }}>
              <View style={{ marginBottom: 6 }}>
                <ZenStatusBadge kind={ev.kind} />
              </View>
              <ZenText
                style={{
                  fontFamily: FONTS.sansMedium,
                  fontSize: 16.5,
                  color: t.fg,
                  marginBottom: 4,
                  letterSpacing: -0.16,
                }}
              >
                {ev.title}
              </ZenText>
              <ZenText
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: t.fg3,
                  letterSpacing: 0.66,
                }}
              >
                {ev.date.toUpperCase()} · {ev.attendees} ATTENDEES
              </ZenText>
            </View>
            <IconChevron color={t.fg3} />
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate('CreateDescribe')}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 38,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: t.accent,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.32,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 24,
          elevation: 8,
        }}
      >
        <IconPlus color="#0a0a0a" />
      </Pressable>
    </View>
  );
}
