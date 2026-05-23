import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../theme';
import { ZenBrandBar } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenInput } from '../components/ZenInput';
import { ZenButton } from '../components/ZenButton';
import { ScreenProps } from '../navigation/types';

export function SignUpScreen({ navigation }: ScreenProps<'SignUp'>) {
  const t = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const pwMatch = pw.length >= 6 && pw === pw2;
  const pwMismatch = pw2.length > 0 && pw !== pw2;
  const valid = name.length > 1 && email.includes('@') && pwMatch;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenBrandBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton
          label="Continue"
          variant={valid ? 'primary' : 'disabled'}
          trailingArrow
          onPress={() => valid && navigation.replace('Keyboard')}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <ZenText variant="mark" tone="fg3">Have an account?</ZenText>
          <ZenButton label="Log in" variant="link" onPress={() => navigation.replace('Login')} />
        </View>
      </Anchor>
    </View>
  );
}
