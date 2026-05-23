import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { FONTS, RADIUS, useTheme } from '../theme';
import { ZenText } from './ZenText';
import { Dot } from './Spinner';
import { IconClose, IconPlus, IconSend } from '../icons';
import type { ZenEvent } from '../data/events';

type Receipt = {
  id: string;
  label: string;
  items: { qty: number; name: string; price: number }[];
  total: number;
};

const CHAT_RECEIPTS: Receipt[] = [
  {
    id: 'r1',
    label: 'Sister Ray bar tab',
    items: [
      { qty: 4, name: 'Espresso Martini', price: 13 },
      { qty: 2, name: 'House Red 75cl', price: 32 },
      { qty: 3, name: 'Negroni', price: 12 },
      { qty: 2, name: 'Aperol Spritz', price: 11 },
      { qty: 2, name: 'Sparkling water', price: 4 },
    ],
    total: 158,
  },
  {
    id: 'r2',
    label: 'Uber · venue → home',
    items: [{ qty: 1, name: 'Uber Comfort, Hackney → Bethnal Green', price: 18.4 }],
    total: 18.4,
  },
  {
    id: 'r3',
    label: 'Late-night cake run',
    items: [
      { qty: 1, name: 'Cutter & Squidge sponge', price: 65 },
      { qty: 1, name: 'Candles + lighter', price: 6 },
    ],
    total: 71,
  },
];

const SUGGESTIONS = ['Move start +30 min', 'Draft a reminder', "Who hasn't paid?"];

type Msg = { role: 'user' | 'assistant'; content: string; attachment?: Receipt | null };

// Mock AI response (production would call Anthropic API)
async function mockComplete(ev: ZenEvent, history: Msg[]): Promise<string> {
  await new Promise((r) => setTimeout(r, 900));
  const last = history[history.length - 1];
  if (last?.attachment) {
    const a = last.attachment;
    const perHead = (a.total / ev.attendees).toFixed(2);
    return `Got it. "${a.label}" came to £${a.total.toFixed(2)} across ${a.items.length} item${a.items.length === 1 ? '' : 's'}. Split ${ev.attendees} ways that's £${perHead} a head. Want me to push this update to the splitter?`;
  }
  if (/move/i.test(last?.content || '')) {
    return `Moving ${ev.title} by +30 min puts the new start at a slightly tighter slot for guests. I can update the calendar invite and message the group. Confirm?`;
  }
  if (/draft|remind/i.test(last?.content || '')) {
    return `"Quick reminder: ${ev.title} is ${ev.date} at ${ev.time}, ${ev.location}. Let me know if anything's changed your end." Want me to send it to the group chat?`;
  }
  if (/paid|payment|pay/i.test(last?.content || '')) {
    return `So far 9 of ${ev.attendees} have settled. Outstanding: Jules, Marcus, Anya. Want me to nudge them with a one-line reminder and the splitter link?`;
  }
  return `Noted. I've got the full picture on ${ev.title} so I can update the splitter, calendar, or planner chart on your say-so. What do you want me to change?`;
}

export function EventChatPanel({ event }: { event: ZenEvent }) {
  const t = useTheme();
  const greeting = `Hi. I've got the full picture on ${event.title}. Ask me to update the splitter, the planner chart, the calendar, or just to draft a message. You can attach a receipt and I'll itemise + split it.`;
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Receipt | null>(null);
  const [attachMenu, setAttachMenu] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text && !attachment) return;
    const userMsg: Msg = { role: 'user', content: text, attachment };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setAttachment(null);
    setLoading(true);
    try {
      const response = await mockComplete(event, next);
      setMessages((m) => [...m, { role: 'assistant', content: response }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "Couldn't reach the model just now. Give it another go in a sec." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>ASK ZENEMIC</ZenText>

      <View
        style={{
          borderWidth: 0.5,
          borderColor: t.hairline,
          borderRadius: RADIUS.lg,
          backgroundColor: t.surface,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          ref={scrollRef}
          style={{ maxHeight: 340, minHeight: 100 }}
          contentContainerStyle={{ padding: 14, gap: 10 }}
        >
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m} />
          ))}
          {loading ? (
            <View style={{ flexDirection: 'row', gap: 4, paddingVertical: 8, marginLeft: 4 }}>
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
            </View>
          ) : null}
        </ScrollView>

        {messages.length <= 1 && !loading ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingBottom: 10 }}>
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                onPress={() => send(s)}
                style={{
                  borderWidth: 0.5,
                  borderColor: t.hairline,
                  borderRadius: RADIUS.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <ZenText
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10.5,
                    letterSpacing: 1.05,
                    textTransform: 'uppercase',
                    color: t.fg2,
                  }}
                >
                  {s}
                </ZenText>
              </Pressable>
            ))}
          </View>
        ) : null}

        {attachment ? (
          <View style={{ padding: 10, borderTopWidth: 0.5, borderTopColor: t.hairline }}>
            <ReceiptCard receipt={attachment} compact onRemove={() => setAttachment(null)} />
          </View>
        ) : null}

        <View
          style={{
            position: 'relative',
            borderTopWidth: 0.5,
            borderTopColor: t.hairline,
            padding: 10,
            paddingLeft: 12,
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 8,
            backgroundColor: t.surface,
          }}
        >
          <Pressable
            onPress={() => setAttachMenu((v) => !v)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: attachMenu ? t.fg : t.fg3Bg,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ rotate: attachMenu ? '45deg' : '0deg' }],
            }}
          >
            <IconPlus color={attachMenu ? t.bg : t.fg} />
          </Pressable>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={attachment ? 'Add a note (optional)…' : 'Ask Zenemic anything…'}
            placeholderTextColor={t.fg3}
            multiline
            style={{
              flex: 1,
              fontFamily: FONTS.sans,
              fontSize: 14.5,
              color: t.fg,
              maxHeight: 110,
              paddingVertical: 6,
            }}
          />

          <Pressable
            onPress={() => send()}
            disabled={loading || (!input.trim() && !attachment)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: input.trim() || attachment ? t.accent : t.fg3Bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconSend color={input.trim() || attachment ? '#0a0a0a' : t.fg3} />
          </Pressable>

          {attachMenu ? (
            <View
              style={{
                position: 'absolute',
                left: 10,
                bottom: 56,
                backgroundColor: t.bg,
                borderWidth: 0.5,
                borderColor: t.hairline,
                borderRadius: RADIUS.md,
                minWidth: 220,
                overflow: 'hidden',
                zIndex: 4,
              }}
            >
              <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 }}>
                <ZenText variant="label" tone="fg3">Attach receipt</ZenText>
              </View>
              {CHAT_RECEIPTS.map((r, i) => (
                <Pressable
                  key={r.id}
                  onPress={() => {
                    setAttachment(r);
                    setAttachMenu(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderTopWidth: i > 0 ? 0.5 : 0,
                    borderTopColor: t.hairline,
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 36,
                      borderRadius: 3,
                      backgroundColor: t.fg3Bg,
                      borderWidth: 0.5,
                      borderColor: t.hairline,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <ZenText style={{ fontFamily: FONTS.sansMedium, fontSize: 13.5, color: t.fg }}>{r.label}</ZenText>
                    <ZenText
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 10,
                        letterSpacing: 1,
                        color: t.fg3,
                        marginTop: 2,
                      }}
                    >
                      £{r.total.toFixed(2)} · {r.items.length} {r.items.length === 1 ? 'ITEM' : 'ITEMS'}
                    </ZenText>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function ChatMessage({ message }: { message: Msg }) {
  const t = useTheme();
  const isUser = message.role === 'user';
  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 6,
        maxWidth: '100%',
      }}
    >
      {message.attachment ? (
        <View style={{ maxWidth: 280 }}>
          <ReceiptCard receipt={message.attachment} />
        </View>
      ) : null}
      {message.content ? (
        <View
          style={{
            maxWidth: 280,
            paddingHorizontal: 13,
            paddingVertical: 9,
            borderRadius: 14,
            backgroundColor: isUser ? t.fg : t.fg3Bg,
            borderBottomRightRadius: isUser ? 4 : 14,
            borderBottomLeftRadius: isUser ? 14 : 4,
          }}
        >
          <ZenText
            style={{
              color: isUser ? t.bg : t.fg,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {message.content}
          </ZenText>
        </View>
      ) : null}
    </View>
  );
}

function ReceiptCard({
  receipt,
  compact,
  onRemove,
}: {
  receipt: Receipt;
  compact?: boolean;
  onRemove?: () => void;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: t.hairline,
        borderRadius: RADIUS.md,
        backgroundColor: t.surface2,
        padding: compact ? 10 : 12,
        flexDirection: 'row',
        gap: 12,
        alignItems: compact ? 'center' : 'flex-start',
      }}
    >
      <View
        style={{
          width: compact ? 32 : 44,
          height: compact ? 42 : 56,
          borderRadius: 4,
          backgroundColor: t.fg3Bg,
          borderWidth: 0.5,
          borderColor: t.hairline,
        }}
      />
      <View style={{ flex: 1 }}>
        <ZenText style={{ fontFamily: FONTS.sansMedium, fontSize: 13.5, color: t.fg }}>{receipt.label}</ZenText>
        <ZenText
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 1.2,
            color: t.fg3,
            marginTop: 2,
            textTransform: 'uppercase',
          }}
        >
          £{receipt.total.toFixed(2)} · {receipt.items.length} {receipt.items.length === 1 ? 'item' : 'items'}
        </ZenText>
        {!compact ? (
          <View style={{ marginTop: 8, gap: 3 }}>
            {receipt.items.map((it, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <ZenText style={{ fontSize: 12, color: t.fg2, flex: 1 }}>
                  {it.qty}× {it.name}
                </ZenText>
                <ZenText style={{ fontFamily: FONTS.mono, fontSize: 11, color: t.fg3 }}>
                  £{(it.qty * it.price).toFixed(2)}
                </ZenText>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          hitSlop={6}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: t.fg3Bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconClose color={t.fg2} />
        </Pressable>
      ) : null}
    </View>
  );
}
