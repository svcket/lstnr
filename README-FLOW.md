## Entry Flow Logic

The app entry flow is managed by `AuthContext` and `RootNavigator`.

1. **App Boot**: `App.tsx` loads fonts. `AuthContext` mounts and checks `SecureStore` for:
   - `lstnr_user_session`: Valid user token/object.
   - `lstnr_onboarding_completed`: Boolean flag.
2. **Splash State**: While `AuthContext` is loading (2s delay or method execution), `splashLoading` is true. `RootNavigator` renders `<SplashScreen />`.
3. **Routing**:
   - If `splashLoading` is false:
   - Check `user`. If null -> Show `<LoginScreen />`.
   - Check `onboarded`. If false -> Show `<OnboardingScreen />`.
   - Else -> Show `<AppNavigator />` (Main Tabs).

## Styling New Screens

Use the primitives in `@components/ui`:

- `<Screen>`: Usage wrapper for SafeArea.
- `<Button>`: Standard calls to action.
- `<TextField>`: Input forms.

Use constants from `@constants/theme`:

- `COLORS`: Use `primary` (Volt) for accents, `surface` for cards.
- `FONT_FAMILY`: `header` (Oswald) for titles, `body` (Inter) for text.
