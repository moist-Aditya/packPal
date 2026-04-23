import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { getAllBoxes } from '@/db/helpers/boxes';
import { useCallback } from 'react';
import { useLayoutEffect } from 'react';

export default function BoxesScreen() {
  const router = useRouter();

  const [boxes, setBoxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoxes = async () => {
    try {
      const res = await getAllBoxes();
      setBoxes(res);
    } catch (err) {
      console.log('Error fetching boxes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  // 🔄 refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBoxes();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // 📭 EMPTY STATE
  if (boxes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <Text style={{ fontSize: 18 }}>No boxes yet 📦</Text>

        <TouchableOpacity
          onPress={() => router.push('/boxes/add')}
          style={{
            padding: 12,
            backgroundColor: '#000',
            borderRadius: 8,
          }}>
          <Text style={{ color: '#fff' }}>Add Box</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📦 LIST
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Boxes',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/boxes/add')}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Add</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={boxes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(tabs)/boxes/${item.id}`)}>
            <View
              style={{
                padding: 16,
                borderRadius: 10,
                backgroundColor: '#f2f2f2',
              }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.label}</Text>

              {item.category && <Text style={{ color: '#666' }}>{item.category}</Text>}

              <Text
                style={{
                  marginTop: 6,
                  color: item.isUnpacked ? 'green' : 'orange',
                  fontWeight: '500',
                }}
              >
                {item.isUnpacked ? 'Unpacked' : 'Packed'}
              </Text>

              <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}
