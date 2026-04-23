import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { getBoxById } from '@/db/helpers/boxes';
import { getItemsByBoxId } from '@/db/helpers/items';
import { toggleBoxUnpacked } from '@/db/helpers/boxes';
import { theme } from '@/theme'; // Import your theme

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '', // Keep header clean; we show label in the body
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push(`/boxes/${id}/add-item`)}
              style={{ marginRight: 8 }}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 16 }}>+ Add Item</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m }}>
        {/* --- BOX HEADER CARD --- */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            letterSpacing: -0.5
          }}>
            {box.label}
          </Text>

          {box.category && (
            <Text style={{
              color: theme.colors.accent,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              fontSize: 12,
              marginTop: 4
            }}>
              {box.category}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
              padding: 16,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 2 }}>Status</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: box.isUnpacked ? theme.colors.success : theme.colors.primary
              }}>
                {box.isUnpacked ? 'Unpacked at destination' : 'Packed & Ready'}
              </Text>
            </View>

            <Switch
              value={box.isUnpacked}
              trackColor={{ false: '#3E3E3E', true: theme.colors.success + '40' }}
              thumbColor={box.isUnpacked ? theme.colors.success : '#f4f3f4'}
              ios_backgroundColor="#3E3E3E"
              onValueChange={async (val) => {
                await toggleBoxUnpacked(id!, val);
                setBox({ ...box, isUnpacked: val });
              }}
            />
          </View>
        </View>

        {/* --- ITEMS SECTION --- */}
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: theme.colors.textPrimary,
          marginBottom: 12
        }}>
          Items ({items.length})
        </Text>

        {items.length === 0 ? (
          <View style={{
            flex: 1,
            marginTop: 40,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16
          }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>This box is empty</Text>
            <TouchableOpacity
              onPress={() => router.push(`/boxes/${id}/add-item`)}
              style={{
                backgroundColor: theme.colors.accent,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: theme.borderRadius,
              }}>
              <Text style={{ color: theme.colors.background, fontWeight: '700' }}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 16,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderLeftWidth: item.isEssential ? 4 : 0,
                  borderLeftColor: theme.colors.accent, // Walnut highlight for essentials
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    fontWeight: '600',
                    fontSize: 16,
                    color: theme.colors.textPrimary
                  }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.colors.accent, fontWeight: '700' }}>
                    x{item.quantity}
                  </Text>
                </View>

                {item.description && (
                  <Text style={{ color: theme.colors.textSecondary, marginTop: 4, fontSize: 14 }}>
                    {item.description}
                  </Text>
                )}

                {item.isEssential && (
                  <View style={{
                    marginTop: 8,
                    backgroundColor: theme.colors.accent + '15',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4
                  }}>
                    <Text style={{
                      color: theme.colors.accent,
                      fontSize: 10,
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      Essential
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>
    </>
  );
}