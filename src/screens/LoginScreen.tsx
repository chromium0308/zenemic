import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenInput } from '../components/ZenInput';
import { ZenButton } from '../components/ZenButton';
import { ScreenProps } from '../navigation/types';

export function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const t = useTheme();
  const [email, setEmail] = useState('eve@email.com');
  const [pw, setPw] = useState('••••••••');

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="BACK TO SIGN UP" onBack={() => navigation.replace('SignUp')} showMenu={false} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section paddingTop={40} gap={28}>
          <View>
            <ZenText variant="eyebrow" tone="fg3" style={{ marginBottom: 12 }}>WELCOME BACK</ZenText>
            <ZenText variant="h1">Pick up where{'\n'}you left off.</ZenText>
          </View>
          <View style={{ gap: 14 }}>
            <ZenInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <ZenInput label="Password" value={pw} onChangeText={setPw} secureTextEntry />
            <View style={{ alignItems: 'flex-end' }}>
              <ZenButton label="Forgot password" variant="link" onPress={() => navigation.navigate('Forgot')} />
            </View>
          </View>
        </Section>
      </ScrollView>
      <Anchor>
        <ZenButton label="Log in" variant="primary" trailingArrow onPress={() => navigation.replace('Keyboard')} />
      </Anchor>
    </View>
  );
}
