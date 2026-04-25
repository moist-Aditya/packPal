import 'react-native-get-random-values';
import '../global.css';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initDB } from '@/db/migrate';
import { theme } from '@/theme'; // Importing your custom theme
import { ActivityIndicator, View } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootStack() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        setReady(true);
      } catch (e) {
        console.log('DB init failed', e);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      {/* Set status bar to light to contrast against the dark background */}
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          // Header styling
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.textPrimary,
          headerShadowVisible: false, // Clean, modern look without lines

          // Background color for all screens in the stack
          contentStyle: {
            backgroundColor: theme.colors.background,
          },

          // Modern title font weight
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}
