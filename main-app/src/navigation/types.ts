import type { ZenEvent } from '../data/events';
import type { ApiEvent, ExtractedDraft } from '../types/api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type Draft = {
  message?: string;
  /** Raw AI extraction — carries the non-edited fields (startsAtISO, guests, currency…). */
  extracted?: ExtractedDraft;
  fields?: {
    title: string;
    date: string;
    time: string;
    location: string;
    attendees: string;
    budget: string;
    splitMode: string;
  };
  /** The event created by POST /events, handed to CreateSuccess → EventDetail. */
  created?: ApiEvent;
};

export type RootStackParamList = {
  Splash: undefined;
  SignUp: undefined;
  Login: undefined;
  Forgot: undefined;
  Keyboard: undefined;
  Events: undefined;
  // The API event is a superset of ZenEvent, so either passes structurally.
  EventDetail: { event: ZenEvent };
  PlannerChart: { event: ZenEvent };
  Splitter: { eventId: string; title?: string };
  Album: { eventId: string; title?: string };
  CreateDescribe: undefined;
  CreateConfirm: undefined;
  CreateProcessing: undefined;
  CreateSuccess: undefined;
  Settings: undefined;
};

export type ScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
