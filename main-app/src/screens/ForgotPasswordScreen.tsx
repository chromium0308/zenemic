import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenInput } from '../components/ZenInput';
import { ZenButton } from '../components/ZenButton';
import { IconMail } from '../icons';
import { useAuth } from '../lib/auth';
import { useKeyboardInset } from '../lib/useKeyboardInset';
import { ScreenProps } from '../navigation/types';

export function ForgotPasswordScreen({ navigation }: ScreenProps<'Forgot'>) {
  const t = useTheme();
  const { resetPassword } = useAuth();
  const keyboardInset = useKeyboardInset();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = email.includes('@') && email.includes('.');

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingBottom: keyboardInset }}>
      <ZenChrome
        label={sent ? 'CHECK YOUR INBOX' : 'BACK TO LOGIN'}
        onBack={() => navigation.goBack()}
        showMenu={false}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        {!sent ? (
          <Section paddingTop={40} gap={28}>
            <View>
              <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>FORGOT IT?</ZenText>
              <ZenText variant="h1">No worries.{'\n'}Let's get you{'\n'}back in.</ZenText>
              <ZenText variant="body" style={{ marginTop: 12 }}>
                Enter the email tied to your Zenemic account and we'll send a one-time reset link.
              </ZenText>
            </View>
            <ZenInput
              label="Email"
              placeholder="eve@email.com"
              value={email}
              onChangeText={setEmail}
              autoFocus
              keyboardType="email-address"
              autoCapitalize="none"
              onSubmitEditing={submit}
            />
            {error ? <ZenText variant="body" style={{ color: t.danger }}>{error}</ZenText> : null}
          </Section>
        ) : (
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
              <IconMail color={t.accent} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <ZenText variant="eyebrow" tone="fg3">SENT</ZenText>
              <ZenText variant="h1" style={{ textAlign: 'center', marginTop: 4 }}>Check your{'\n'}inbox.</ZenText>
              <ZenText variant="body" style={{ marginTop: 12, textAlign: 'center', maxWidth: 280 }}>
                We've sent a reset link to <ZenText style={{ color: t.fg, fontWeight: '500' }}>{email}</ZenText>. It expires in 15 minutes.
              </ZenText>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <ZenText variant="mark" tone="fg3">NO EMAIL AFTER A MINUTE?</ZenText>
              <ZenButton label="Try a different address" variant="link" onPress={() => setSent(false)} />
            </View>
          </Section>
        )}
      </ScrollView>
      <Anchor>
        {!sent ? (
          <ZenButton
            label={loading ? 'Sending…' : 'Send reset link'}
            variant={valid && !loading ? 'primary' : 'disabled'}
            trailingArrow={!loading}
            onPress={submit}
          />
        ) : (
          <>
            <ZenButton label="Back to log in" variant="primary" onPress={() => navigation.goBack()} />
            <View style={{ alignItems: 'center' }}>
              <ZenButton label="Resend link" variant="link" onPress={submit} />
            </View>
          </>
        )}
      </Anchor>
    </View>
  );
}
