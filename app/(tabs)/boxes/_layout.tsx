import { Stack } from 'expo-router';
import { theme } from '@/theme'; // Importing your dark theme

export default function BoxesLayout() {
  return (
    <Stack
      screenOptions={{
        // 1. Header background using the slightly lighter 'surface' color
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        // 2. Header text using your off-white 'textPrimary'
        headerTintColor: theme.colors.textPrimary,
        // 3. Remove the bottom border/shadow for a modern, flat look
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        // 4. Ensure the background behind screens matches the dark theme
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );
}