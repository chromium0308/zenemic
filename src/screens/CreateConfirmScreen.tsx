import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { Spinner } from '../components/Spinner';
import { useDraft } from '../navigation/DraftContext';
import { ScreenProps } from '../navigation/types';

const DEFAULT_FIELDS = {
  title: "Mira's 28th Birthday",
  date: '07 Jun 2026',
  time: '7:30 PM',
  location: 'Sister Ray, Hackney',
  attendees: '12',
  budget: '£480',
  splitMode: 'Even split',
};

export function CreateConfirmScreen({ navigation }: ScreenProps<'CreateConfirm'>) {
  const t = useTheme();
  const { draft, setDraft } = useDraft();
  const [fields, setFields] = useState(draft.fields ?? DEFAULT_FIELDS);
  const [extracting, setExtracting] = useState(!draft.fields);

  useEffect(() => {
    if (!extracting) return;
    const id = setTimeout(() => setExtracting(false), 1200);
    return () => clearTimeout(id);
  }, [extracting]);

  const update = (k: keyof typeof fields, v: string) => setFields({ ...fields, [k]: v });

  if (extracting) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <ZenChrome label="EVENT.CREATE" onBack={() => navigation.goBack()} progress={2} total={4} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          <Spinner size={24} borderWidth={2} />
          <ZenText variant="eyebrow" tone="fg3">READING MESSAGE</ZenText>
          <ZenText variant="body" style={{ textAlign: 'center', maxWidth: 280 }}>
            Zenemic AI is pulling out the event details…
          </ZenText>
        </View>
      </View>
    );
  }

  const rows: { key: keyof typeof fields; label: string }[] = [
    { key: 'title', label: 'Event title' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'location', label: 'Location' },
    { key: 'attendees', label: 'Attendees' },
    { key: 'budget', label: 'Total budget' },
    { key: 'splitMode', label: 'Split mode' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENT.CREATE" onBack={() => navigation.goBack()} progress={2} total={4} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Section paddingTop={28} gap={22}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>CONFIRM · 02 / 04</ZenText>
            <ZenText variant="h1">Look right?</ZenText>
            <ZenText variant="body" style={{ marginTop: 12 }}>
              Tap any field to edit before we set things up.
            </ZenText>
          </View>

          <View
            style={{
              borderWidth: 0.5,
              borderColor: t.hairline,
              borderRadius: RADIUS.lg,
              backgroundColor: t.surface,
              overflow: 'hidden',
            }}
          >
            {rows.map((r, i) => (
              <EditableRow
                key={r.key}
                label={r.label}
                value={fields[r.key]}
                onChange={(v) => update(r.key, v)}
                isLast={i === rows.length - 1}
              />
            ))}
          </View>

          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 8 }}>WILL GENERATE</ZenText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {['Planner chart', 'Calendar event', 'Payment splitter', 'Location links', 'Shared album'].map((tag) => (
                <View
                  key={tag}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderWidth: 0.5,
                    borderColor: t.hairline,
                    borderRadius: RADIUS.pill,
                  }}
                >
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
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton
          label="Looks right · Create"
          variant="primary"
          trailingArrow
          onPress={() => {
            setDraft({ ...draft, fields });
            navigation.navigate('CreateProcessing');
          }}
        />
      </Anchor>
    </View>
  );
}

function EditableRow({
  label,
  value,
  onChange,
  isLast,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isLast: boolean;
}) {
  const t = useTheme();
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const commit = () => {
    onChange(v);
    setEditing(false);
  };

  return (
    <Pressable
      onPress={() => !editing && setEditing(true)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: t.hairline,
        gap: 12,
      }}
    >
      <ZenText
        style={{
          width: 110,
          fontFamily: FONTS.mono,
          fontSize: 10.5,
          letterSpacing: 1.47,
          textTransform: 'uppercase',
          color: t.fg3,
        }}
      >
        {label}
      </ZenText>
      {editing ? (
        <TextInput
          ref={ref}
          value={v}
          onChangeText={setV}
          onBlur={commit}
          onSubmitEditing={commit}
          style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 6,
            fontSize: 14,
            color: t.fg,
            borderWidth: 0.5,
            borderColor: t.fg2,
            borderRadius: 8,
            backgroundColor: t.bg,
          }}
        />
      ) : (
        <>
          <ZenText style={{ flex: 1, fontSize: 14.5, color: t.fg }}>{value}</ZenText>
          <ZenText
            style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2, color: t.fg3 }}
          >
            EDIT
          </ZenText>
        </>
      )}
    </Pressable>
  );
}
