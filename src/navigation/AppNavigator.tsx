import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { DraftProvider } from './DraftContext';
import type { RootStackParamList } from './types';

import { SplashScreen } from '../screens/SplashScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { KeyboardSetupScreen } from '../screens/KeyboardSetupScreen';
import { EventsListScreen } from '../screens/EventsListScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { PlannerChartScreen } from '../screens/PlannerChartScreen';
import { CreateDescribeScreen } from '../screens/CreateDescribeScreen';
import { CreateConfirmScreen } from '../screens/CreateConfirmScreen';
import { CreateProcessingScreen } from '../screens/CreateProcessingScreen';
import { CreateSuccessScreen } from '../screens/CreateSuccessScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const t = useTheme();
  const navTheme = {
    ...(t.mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(t.mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: t.bg,
      card: t.bg,
      text: t.fg,
      border: t.hairline,
      primary: t.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <DraftProvider>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: t.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
          <Stack.Screen name="Keyboard" component={KeyboardSetupScreen} />
          <Stack.Screen name="Events" component={EventsListScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="PlannerChart" component={PlannerChartScreen} />
          <Stack.Screen name="CreateDescribe" component={CreateDescribeScreen} />
          <Stack.Screen name="CreateConfirm" component={CreateConfirmScreen} />
          <Stack.Screen name="CreateProcessing" component={CreateProcessingScreen} />
          <Stack.Screen name="CreateSuccess" component={CreateSuccessScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </DraftProvider>
    </NavigationContainer>
  );
}
