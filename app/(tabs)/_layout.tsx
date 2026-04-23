import { Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import { theme } from '@/theme';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary, // Sage Green
        tabBarInactiveTintColor: theme.colors.textSecondary,

        tabBarStyle: {
          // 1. Elevation: Slightly lighter than #121212 to create a "lifted" layer
          backgroundColor: '#222222',

          // 2. Clear Border: Separates the dock from the list content
          borderTopWidth: 1.5,
          borderTopColor: theme.colors.border,

          // 3. Generous Spacing: Fixed the "cluttered" feeling
          height: Platform.OS === 'ios' ? 100 : 60,
          paddingBottom: Platform.OS === 'ios' ? 35 : 10,
          paddingTop: 0,

          // 4. Strong Shadow: Deep elevation so it sits "above" the boxes
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.4,
          shadowRadius: 15,
          elevation: 25,

          // Ensures content doesn't bleed through
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },

        tabBarLabelStyle: {
          fontWeight: '800', // Chunkier font for that Pinterest aesthetic
          fontSize: 11,
          marginTop: 6,      // Extra space between icon and label
          letterSpacing: 1,
          textTransform: 'uppercase', // Professional boutique app feel
        },

        // Hide the header as requested
        headerShown: false,
      }}>

      <Tabs.Screen
        name="boxes"
        options={{
          title: 'Boxes',
          tabBarIcon: ({ color }) => <TabBarIcon name="archive" color={color} />,
        }}
      />

      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
    </Tabs>
  );
}