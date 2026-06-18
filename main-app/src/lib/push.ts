import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

/**
 * Ask for permission and return this device's Expo push token, or `null` if we
 * can't get one — on a simulator/emulator, when permission is denied, or when no
 * EAS `projectId` is configured yet. Returning null (never throwing) keeps the
 * backend's host-payment push purely opt-in: no token simply means no push.
 *
 * Safe to call repeatedly — Expo returns the same token for a device.
 * Delivering to a real Android build also needs FCM credentials set up via EAS.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Push tokens only exist on physical devices, not simulators/emulators.
  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  let status = (await Notifications.getPermissionsAsync()).status;
  if (status !== 'granted') {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== 'granted') return null;

  // A projectId is required to mint an Expo push token. It's written into
  // app config by `eas init`; until then we can't get a token (returns null).
  const extra = (Constants.expoConfig?.extra ?? {}) as { eas?: { projectId?: string } };
  const projectId = extra.eas?.projectId;
  if (!projectId) return null;

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch {
    return null;
  }
}
