import React from 'react';
import { ScrollView, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { IconBigCheck, IconCheck } from '../icons';
import { useDraft } from '../navigation/DraftContext';
import { EVENTS } from '../data/events';
import { ScreenProps } from '../navigation/types';

const PILLS = ['Chart', 'Calendar', 'Splitter', 'Locations', 'Album'];

export function CreateSuccessScreen({ navigation }: ScreenProps<'CreateSuccess'>) {
  const t = useTheme();
  const { draft } = useDraft();

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENT.CREATE" progress={4} total={4} showMenu={false} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section paddingTop={60} gap={28} style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              borderWidth: 0.5,
              borderColor: t.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBigCheck color={t.accent} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <ZenText variant="eyebrow" tone="fg3">DONE · 04 / 04</ZenText>
            <ZenText variant="h1" style={{ marginTop: 4, textAlign: 'center' }}>Event ready.</ZenText>
            <ZenText variant="body" style={{ marginTop: 12, textAlign: 'center', maxWidth: 280 }}>
              {draft.fields?.title || 'Your event'} is set up with all 5 automated resources.
            </ZenText>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {PILLS.map((tag) => (
              <View
                key={tag}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: t.surface,
                  borderWidth: 0.5,
                  borderColor: t.hairline,
                  borderRadius: RADIUS.pill,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <IconCheck color={t.accent} />
                <ZenText
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10.5,
                    letterSpacing: 1.47,
                    textTransform: 'uppercase',
                    color: t.fg2,
                  }}
                >
                  {tag}
                </ZenText>
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton
          label="Open event"
          variant="primary"
          onPress={() => {
            navigation.replace('EventDetail', { event: EVENTS[0] });
          }}
        />
        <ZenButton label="Back to events" variant="ghost" onPress={() => navigation.popToTop()} />
      </Anchor>
    </View>
  );
}
