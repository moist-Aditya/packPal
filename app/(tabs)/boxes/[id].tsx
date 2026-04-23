import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { getBoxById } from '@/db/helpers/boxes';
import { getItemsByBoxId } from '@/db/helpers/items';
import { Switch } from 'react-native';
import { toggleBoxUnpacked } from '@/db/helpers/boxes';

export default function BoxDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [box, setBox] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const fetchData = async () => {
    if (!id) return;

    const boxData = await getBoxById(id);
    const itemsData = await getItemsByBoxId(id);

    setBox(boxData);
    setItems(itemsData);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id])
  );

  if (!box) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: box.label,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/boxes/${id}/add-item`)}>
              <Text style={{ color: '#007AFF' }}>Add Item</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={{ flex: 1, padding: 16 }}>
        {/* Box Info */}
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{box.label}</Text>

        {box.category && <Text style={{ color: '#666' }}>{box.category}</Text>}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {box.isUnpacked ? 'Unpacked' : 'Packed'}
          </Text>

          <Switch
            value={box.isUnpacked}
            onValueChange={async (val) => {
              await toggleBoxUnpacked(id, val);
              setBox({ ...box, isUnpacked: val }); // instant UI update
            }}
          />
        </View>

        {/* Items */}
        {items.length === 0 ? (
          <View style={{ marginTop: 40, alignItems: 'center', gap: 12 }}>
            <Text>No items in this box</Text>

            <TouchableOpacity
              onPress={() => router.push(`/boxes/${id}/add-item`)}
              style={{
                backgroundColor: '#000',
                padding: 12,
                borderRadius: 8,
              }}>
              <Text style={{ color: '#fff' }}>Add Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ marginTop: 16, gap: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 12,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                }}>
                <Text style={{ fontWeight: '500' }}>
                  {item.name} (x{item.quantity})
                </Text>

                {item.description && <Text style={{ color: '#666' }}>{item.description}</Text>}

                {item.isEssential && <Text style={{ color: 'red', marginTop: 4 }}>Essential</Text>}
              </View>
            )}
          />
        )}
      </View>
    </>
  );
}
