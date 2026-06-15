import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme';

export function ZenToggle({
  defaultOn = false,
  on: controlled,
  onChange,
}: {
  defaultOn?: boolean;
  on?: boolean;
  onChange?: (next: boolean) => void;
}) {
  const t = useTheme();
  const [internal, setInternal] = useState(defaultOn);
  const on = controlled !== undefined ? controlled : internal;
  return (
    <Pressable
      onPress={() => {
        const next = !on;
        if (controlled === undefined) setInternal(next);
        onChange?.(next);
      }}
      style={{
        width: 38,
        height: 22,
        borderRadius: 999,
        backgroundColor: on ? t.accent : t.fg3Bg,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 18 : 2,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: '#fff',
        }}
      />
    </Pressable>
  );
}
