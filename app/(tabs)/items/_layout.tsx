import { Stack } from 'expo-router';
import { theme } from '@/theme'; // Importing your custom theme

export default function ItemsLayout() {
  return (
    <Stack
      screenOptions={{
        // 1. Match the header to the surface color for a sleek, layered look
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        // 2. Use your theme's off-white for the title
        headerTintColor: theme.colors.textPrimary,
        // 3. Remove the divider line for that modern Pinterest aesthetic
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        // 4. Ensure the background of the screen content is your deep charcoal
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'All Items',
        }}
      />
    </Stack>
  );
}