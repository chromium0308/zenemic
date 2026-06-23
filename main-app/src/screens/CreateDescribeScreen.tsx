import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FONTS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenInput } from '../components/ZenInput';
import { ZenButton } from '../components/ZenButton';
import { useDraft } from '../navigation/DraftContext';
import { ScreenProps } from '../navigation/types';

const EXAMPLES = [
  'Birthday dinner for Mira at Sister Ray, Saturday 7th June at 7:30. Wines on me, food split evenly. 12 people total.',
  "Mountain cabin trip in the Lake District 14-16 June, 6 of us. Cabin's €720, split 6 ways. Bring waterproofs.",
  'Q3 team offsite, Margate 24-25 June. Travel + hotel covered by the company card.',
];

export function CreateDescribeScreen({ navigation }: ScreenProps<'CreateDescribe'>) {
  const t = useTheme();
  const { draft, setDraft } = useDraft();
  const [msg, setMsg] = useState(draft.message ?? '');
  const exi = 0;

  const valid = msg.trim().length > 8;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome
        label="EVENT.CREATE"
        onBack={() => navigation.goBack()}
        progress={1}
        total={4}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Section paddingTop={28} gap={24}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>INPUT · 01 / 04</ZenText>
            <ZenText variant="h1">Describe{'\n'}your event.</ZenText>
            <ZenText variant="body" style={{ marginTop: 12 }}>
              Write it like you'd text a friend. Zenemic AI will pull out the details: date, time, location, budget, who's coming.
            </ZenText>
          </View>
          <View style={{ gap: 6 }}>
            <ZenInput
              label="ATTENDEE MESSAGE"
              placeholder={EXAMPLES[exi]}
              value={msg}
              onChangeText={setMsg}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
              <ZenText style={{ fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: 1.05, color: t.fg3 }}>
                {msg.length} CHARS
              </ZenText>
            </View>
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton
          label="Continue"
          variant={valid ? 'primary' : 'disabled'}
          trailingArrow
          onPress={() => {
            if (!valid) return;
            // Reset any prior extraction so CreateConfirm re-extracts this message.
            setDraft({ message: msg });
            navigation.navigate('CreateConfirm');
          }}
        />
      </Anchor>
    </View>
  );
}
