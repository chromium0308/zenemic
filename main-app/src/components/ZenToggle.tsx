import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme';

export function ZenToggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const t = useTheme();
  const [on, setOn] = useState(defaultOn);
  return (
    <Pressable
      onPress={() => setOn((v) => !v)}
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
