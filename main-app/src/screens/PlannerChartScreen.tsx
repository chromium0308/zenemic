import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { ZenInput } from '../components/ZenInput';
import { ChartTimeline } from '../components/ChartTimeline';
import { Spinner } from '../components/Spinner';
import { IconEdit } from '../icons';
import { api, ApiError } from '../lib/api';
import type { ApiChart, ApiStage } from '../types/api';
import { ScreenProps } from '../navigation/types';

export function PlannerChartScreen({ navigation, route }: ScreenProps<'PlannerChart'>) {
  const t = useTheme();
  const ev = route.params.event;
  const [chart, setChart] = useState<ApiChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftStages, setDraftStages] = useState<ApiStage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let alive = true;
    setLoading(true);
    api
      .getChart(ev.id)
      .then((c) => {
        if (alive) {
          setChart(c);
          setError(null);
        }
      })
      .catch((e: ApiError) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [ev.id]);

  useFocusEffect(load);

  const stages = chart?.stages ?? [];
  const doneCount = stages.filter((s) => s.done).length;

  const toggle = async (i: number) => {
    const s = stages[i];
    if (!s || !chart) return;
    const next = !s.done;
    setChart({ ...chart, stages: chart.stages.map((x) => (x.id === s.id ? { ...x, done: next } : x)) });
    try {
      await api.setStageDone(ev.id, s.id, next);
    } catch {
      setChart((c) => (c ? { ...c, stages: c.stages.map((x) => (x.id === s.id ? { ...x, done: s.done } : x)) } : c));
    }
  };

  const startEdit = () => {
    setDraftStages(stages.map((s) => ({ ...s })));
    setEditing(true);
  };

  const editStage = (i: number, patch: Partial<ApiStage>) =>
    setDraftStages((d) => d.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const saveEdit = async () => {
    setBusy(true);
    setError(null);
    try {
      const c = await api.editChart(
        ev.id,
        draftStages.map((s) => ({ tag: s.tag, t: s.t, heading: s.heading, body: s.body, kind: s.kind.toUpperCase(), done: s.done })),
      );
      setChart(c);
      setEditing(false);
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="EVENT PLANNER CHART" onBack={() => navigation.goBack()} showMenu={false} />
      {loading && !chart ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size={22} borderWidth={2} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Section paddingTop={22} gap={20}>
            <View>
              <ZenText variant="eyebrow" tone="fg3">{chart?.sub ?? ''}</ZenText>
              <ZenText variant="h2" style={{ marginTop: 4 }}>{chart?.title ?? ev.title}</ZenText>
            </View>

            {!editing ? (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <ZenText style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.32, color: t.fg3 }}>
                    {String(doneCount).padStart(2, '0')} / {String(stages.length).padStart(2, '0')} DONE
                  </ZenText>
                </View>
                <ChartTimeline stages={stages} done={stages.map((s) => s.done)} onToggle={toggle} />
                {error ? <ZenText variant="body" style={{ color: t.danger }}>{error}</ZenText> : null}
                <ZenButton label="Edit chart" variant="ghost" leading={<IconEdit color={t.fg} />} style={{ marginTop: 4 }} onPress={startEdit} />
              </>
            ) : (
              <>
                {draftStages.map((s, i) => (
                  <View key={s.id} style={{ gap: 8, borderWidth: 0.5, borderColor: t.hairline, borderRadius: RADIUS.lg, padding: 14, backgroundColor: t.surface }}>
                    <ZenText variant="eyebrow" tone="fg3">{s.tag} · STAGE {i + 1}</ZenText>
                    <ZenInput label="When" value={s.t} onChangeText={(v) => editStage(i, { t: v })} />
                    <ZenInput label="Heading" value={s.heading} onChangeText={(v) => editStage(i, { heading: v })} />
                    <ZenInput label="Detail" value={s.body} onChangeText={(v) => editStage(i, { body: v })} multiline />
                  </View>
                ))}
                {error ? <ZenText variant="body" style={{ color: t.danger }}>{error}</ZenText> : null}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <ZenButton label="Cancel" variant="ghost" style={{ flex: 1 }} fullWidth={false} onPress={() => setEditing(false)} />
                  <ZenButton label={busy ? 'Saving…' : 'Save chart'} variant={busy ? 'disabled' : 'primary'} style={{ flex: 1 }} fullWidth={false} onPress={saveEdit} />
                </View>
              </>
            )}
          </Section>
        </ScrollView>
      )}
    </View>
  );
}
