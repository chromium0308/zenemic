import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * Android under SDK 54's enforced edge-to-edge no longer resizes the window for
 * the keyboard (`adjustResize` is ignored), so screens shrink themselves instead:
 * apply the returned value as `paddingBottom` on the screen's root view. Shrinking
 * the ScrollView also triggers Android's native focused-child reveal, which scrolls
 * the focused input into view. Returns 0 on iOS, where `automaticallyAdjustKeyboardInsets`
 * on each ScrollView handles the keyboard natively.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const show = Keyboard.addListener('keyboardDidShow', (e) => setInset(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setInset(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return inset;
}
