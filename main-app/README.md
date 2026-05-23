# Zenemic

AI-powered event-planning app for iOS (React Native + Expo).

Implements the design handoff bundle from `claude.ai/design` (see `.design-pkg/` — git-ignored). The design medium was a clickable HTML/JSX prototype; this is the native rewrite.

## Stack

- Expo SDK 51 + React Native 0.74
- TypeScript
- React Navigation (native stack)
- `react-native-svg` for icons
- `@expo-google-fonts/inter` + `@expo-google-fonts/jetbrains-mono`

## Design system

- Light mode default, dark mode supported via `ThemeProvider` (`src/theme.tsx`).
- Coral accent `#FF6B4A`.
- Headings: Inter SemiBold with tight letter-spacing. Labels/eyebrows: JetBrains Mono Medium, uppercase, wide tracking.
- All tokens live in `src/theme.tsx`.

## Screens

`Splash → SignUp → Login → Forgot → Keyboard → Events → EventDetail → PlannerChart`
plus the create flow: `CreateDescribe → CreateConfirm → CreateProcessing → CreateSuccess`
and `Settings`.

Ongoing events render the planner chart inline on the detail page; planned/previous events get it as a tappable resource row.

`EventChatPanel` (`src/components/EventChatPanel.tsx`) uses a mocked AI completion. Swap `mockComplete` for a real Anthropic API call to wire up the live assistant.

## Run

```sh
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android), or scan the QR code with Expo Go.

## Notes / not yet built

- Custom iOS keyboard extension — needs a native target outside RN.
- Messaging-demo screen (WhatsApp-style preview) — prototype-only marketing visual, not part of the shipping flow.
- Live Anthropic API call inside `EventChatPanel` (currently mocked).
