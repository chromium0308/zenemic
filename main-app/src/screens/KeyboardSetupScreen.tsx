import React from 'react';
import { Image, Linking, ScrollView, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { ScreenProps } from '../navigation/types';

const STEPS = [
  'Open iOS Settings',
  'Tap General → Keyboard → Keyboards',
  'Add New Keyboard → Zenemic',
  'Toggle on "Allow Full Access"',
];

export function KeyboardSetupScreen({ navigation }: ScreenProps<'Keyboard'>) {
  const t = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="SETUP · KEYBOARD" onBack={() => navigation.goBack()} showMenu={false} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section paddingTop={24} gap={24}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>ONE MORE STEP</ZenText>
            <ZenText variant="h1">Install the{'\n'}Zenemic keyboard.</ZenText>
            <ZenText variant="body" style={{ marginTop: 14 }}>
              Drop event invites into WhatsApp, iMessage, Snapchat and more, without leaving your chat.
            </ZenText>
          </View>

          <View style={{ borderWidth: 0.5, borderColor: t.hairline, borderRadius: RADIUS.lg, padding: 14, backgroundColor: t.surface }}>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>PREVIEW</ZenText>

            <Image
              source={require('../../assets/keyboard.png')}
              style={{ width: '100%', aspectRatio: 1170 / 816, borderRadius: RADIUS.md, backgroundColor: '#1c1c1e' }}
              resizeMode="contain"
            />

            <ZenText
              style={{
                marginTop: 14,
                fontFamily: FONTS.mono,
                fontSize: 10.5,
                letterSpacing: 1.4,
                color: t.fg3,
                textTransform: 'uppercase',
              }}
            >
              Tap the Zenemic logo key from any chat
            </ZenText>
          </View>

          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 4 }}>INSTRUCTIONS</ZenText>
            <View>
              {STEPS.map((s, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    gap: 14,
                    paddingVertical: 14,
                    borderBottomWidth: i < STEPS.length - 1 ? 0.5 : 0,
                    borderBottomColor: t.hairline,
                    alignItems: 'flex-start',
                  }}
                >
                  <ZenText variant="mark" tone="fg3" style={{ width: 18 }}>
                    {String(i + 1).padStart(2, '0')}
                  </ZenText>
                  <ZenText style={{ flex: 1, fontSize: 14.5, color: t.fg }}>{s}</ZenText>
                </View>
              ))}
            </View>
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton label="Open device Settings" variant="primary" trailingArrow onPress={() => Linking.openSettings()} />
        <View style={{ alignItems: 'center' }}>
          <ZenButton label="Done" variant="link" onPress={() => navigation.goBack()} />
        </View>
      </Anchor>
    </View>
  );
}
