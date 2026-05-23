import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { IconCheck } from '../icons';
import { ScreenProps } from '../navigation/types';

const STEPS = [
  'Open iOS Settings',
  'Tap General → Keyboard → Keyboards',
  'Add New Keyboard → Zenemic',
  'Toggle on "Allow Full Access"',
];

const ROW1 = 'qwertyuiop'.split('');
const ROW2 = 'asdfghjkl'.split('');
const ROW3 = 'zxcvbnm'.split('');

export function KeyboardSetupScreen({ navigation }: ScreenProps<'Keyboard'>) {
  const t = useTheme();
  const [installed, setInstalled] = useState(false);

  const Key = ({ k }: { k: string }) => (
    <View
      style={{
        flex: 1,
        aspectRatio: 1 / 1.25,
        backgroundColor: t.fg3Bg,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
      }}
    >
      <ZenText style={{ fontFamily: FONTS.mono, fontSize: 11, color: t.fg2 }}>{k}</ZenText>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="SETUP · KEYBOARD" showMenu={false} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section paddingTop={24} gap={24}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>ONE MORE STEP</ZenText>
            <ZenText variant="h1">Install the{'\n'}Zenemic keyboard.</ZenText>
            <ZenText variant="body" style={{ marginTop: 14 }}>
              Drop event invites into WhatsApp, iMessage, Snapchat and more, without leaving your chat.
            </ZenText>
          </View>

          <View
            style={{
              borderWidth: 0.5,
              borderColor: t.hairline,
              borderRadius: RADIUS.lg,
              padding: 18,
              backgroundColor: t.surface,
            }}
          >
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 14 }}>PREVIEW</ZenText>

            <View style={{ flexDirection: 'row', marginHorizontal: -2 }}>
              {ROW1.map((k) => <Key key={k} k={k} />)}
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: -2, marginTop: 5, paddingHorizontal: 12 }}>
              {ROW2.map((k) => <Key key={k} k={k} />)}
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: -2, marginTop: 5, paddingHorizontal: 28 }}>
              {ROW3.map((k) => <Key key={k} k={k} />)}
            </View>

            <View style={{ flexDirection: 'row', marginTop: 5, gap: 5 }}>
              <View style={{ flex: 0.7, paddingVertical: 8, backgroundColor: t.fg3Bg, borderRadius: 6, alignItems: 'center' }}>
                <ZenText style={{ fontFamily: FONTS.mono, fontSize: 10, color: t.fg3 }}>123</ZenText>
              </View>
              <View
                style={{
                  flex: 0.55,
                  paddingVertical: 8,
                  backgroundColor: t.accent,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
              >
                <ZenText
                  style={{
                    fontFamily: FONTS.monoSemibold,
                    fontSize: 10,
                    letterSpacing: 1.2,
                    color: '#0a0a0a',
                  }}
                >
                  ZEN
                </ZenText>
              </View>
              <View style={{ flex: 2.2, paddingVertical: 8, backgroundColor: t.fg3Bg, borderRadius: 6, alignItems: 'center' }}>
                <ZenText style={{ fontFamily: FONTS.mono, fontSize: 10, color: t.fg3 }}>space</ZenText>
              </View>
              <View style={{ flex: 0.9, paddingVertical: 8, backgroundColor: t.fg3Bg, borderRadius: 6, alignItems: 'center' }}>
                <ZenText style={{ fontFamily: FONTS.mono, fontSize: 10, color: t.fg3 }}>↵</ZenText>
              </View>
            </View>

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
              Tap the highlighted key from any chat
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
        <ZenButton
          label={installed ? 'Opening Settings…' : 'Open iOS Settings'}
          variant="primary"
          trailingArrow={!installed}
          leading={installed ? <IconCheck color={t.bg} /> : undefined}
          onPress={() => {
            setInstalled(true);
            setTimeout(() => navigation.replace('Events'), 400);
          }}
        />
        <View style={{ alignItems: 'center' }}>
          <ZenButton label="Skip for now" variant="link" onPress={() => navigation.replace('Events')} />
        </View>
      </Anchor>
    </View>
  );
}
