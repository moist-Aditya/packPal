import { Link, Tabs } from 'expo-router';

import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="boxes"
        options={{
          title: 'Boxes',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
