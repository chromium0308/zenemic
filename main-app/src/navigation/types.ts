import type { ZenEvent } from '../data/events';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type Draft = {
  message?: string;
  fields?: {
    title: string;
    date: string;
    time: string;
    location: string;
    attendees: string;
    budget: string;
    splitMode: string;
  };
};

export type RootStackParamList = {
  Splash: undefined;
  SignUp: undefined;
  Login: undefined;
  Forgot: undefined;
  Keyboard: undefined;
  Events: undefined;
  EventDetail: { event: ZenEvent };
  PlannerChart: { event: ZenEvent };
  CreateDescribe: undefined;
  CreateConfirm: undefined;
  CreateProcessing: undefined;
  CreateSuccess: undefined;
  Settings: undefined;
};

export type ScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
