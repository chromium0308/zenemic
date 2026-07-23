import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../theme';
import { ZenBrandBar } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenInput } from '../components/ZenInput';
import { ZenButton } from '../components/ZenButton';
import { IconMail } from '../icons';
import { useAuth } from '../lib/auth';
import { useKeyboardInset } from '../lib/useKeyboardInset';
import { ScreenProps } from '../navigation/types';

export function SignUpScreen({ navigation }: ScreenProps<'SignUp'>) {
  const t = useTheme();
  const { signUp } = useAuth();
  const keyboardInset = useKeyboardInset();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const pwMatch = pw.length >= 6 && pw === pw2;
  const pwMismatch = pw2.length > 0 && pw !== pw2;
  const valid = name.length > 1 && email.includes('@') && pwMatch;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { needsConfirmation } = await signUp(email, pw, name);
      if (needsConfirmation) setSent(true);
      // Otherwise a session exists and AppNavigator swaps to the app automatically.
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <ZenBrandBar />
        <Section paddingTop={60} gap={28} style={{ alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 0.5, borderColor: t.accent, alignItems: 'center', justifyContent: 'center' }}>
            <IconMail color={t.accent} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <ZenText variant="eyebrow" tone="fg3">CONFIRM YOUR EMAIL</ZenText>
            <ZenText variant="h1" style={{ textAlign: 'center', marginTop: 4 }}>Check your{'\n'}inbox.</ZenText>
            <ZenText variant="body" style={{ marginTop: 12, textAlign: 'center', maxWidth: 300 }}>
              We've sent a confirmation link to <ZenText style={{ color: t.fg, fontWeight: '500' }}>{email}</ZenText>. Tap it, then log in.
            </ZenText>
          </View>
        </Section>
        <Anchor>
          <ZenButton label="Go to log in" variant="primary" onPress={() => navigation.replace('Login')} />
        </Anchor>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingBottom: keyboardInset }}>
      <ZenBrandBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <Section paddingTop={40} gap={28}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>ACCOUNT</ZenText>
            <ZenText variant="h1">Create your{'\n'}account</ZenText>
            <ZenText variant="body" style={{ marginTop: 12 }}>
              Plan events, split costs and share photos all from one place.
            </ZenText>
          </View>
          <View style={{ gap: 14 }}>
            <ZenInput label="Full name" placeholder="Eve Lambert" value={name} onChangeText={setName} autoCapitalize="words" />
            <ZenInput label="Email" placeholder="eve@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <ZenInput label="Password" placeholder="At least 6 characters" value={pw} onChangeText={setPw} secureTextEntry />
            <ZenInput
              label="Confirm password"
              labelSuffix={pwMismatch ? "· doesn't match" : pwMatch ? '· ✓' : ''}
              labelTone={pwMismatch ? 'accent' : 'fg3'}
              placeholder="Re-enter your password"
              value={pw2}
              onChangeText={setPw2}
              secureTextEntry
              errorBorder={pwMismatch}
              okBorder={pwMatch}
            />
            {error ? <ZenText variant="body" style={{ color: t.danger }}>{error}</ZenText> : null}
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton
          label={loading ? 'Creating account…' : 'Continue'}
          variant={valid && !loading ? 'primary' : 'disabled'}
          trailingArrow={!loading}
          onPress={submit}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <ZenText variant="mark" tone="fg3">Have an account?</ZenText>
          <ZenButton label="Log in" variant="link" onPress={() => navigation.replace('Login')} />
        </View>
      </Anchor>
    </View>
  );
}
