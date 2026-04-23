import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { getBoxById } from '@/db/helpers/boxes';
import { getItemsByBoxId } from '@/db/helpers/items';
import { toggleBoxUnpacked } from '@/db/helpers/boxes';
import { theme } from '@/theme'; // Import your theme
import { deleteItem } from '@/db/helpers/items';
import { deleteBox } from '@/db/helpers/boxes';
import { Alert } from 'react-native';

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

  // Handler to delete an item
  const handleDelete = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(itemId);
            setItems((prev) => prev.filter((i) => i.id !== itemId));
          },
        },
      ]
    );
  };

  // Handler to delete the box
  const handleDeleteBox = () => {
    Alert.alert(
      'Delete Box',
      'This will delete the box and ALL its items. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBox(id);
            router.back(); // go back to boxes list
          },
        },
      ]
    );
  };

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
          headerTitle: '',
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

        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 100 }} // Extra padding for the delete button
          ListEmptyComponent={
            <View style={{ marginTop: 40, alignItems: 'center', gap: 16 }}>
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
          }
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                borderLeftWidth: item.isEssential ? 4 : 0,
                borderLeftColor: theme.colors.accent,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 17, color: theme.colors.textPrimary, flex: 1 }}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.colors.accent, fontWeight: '800', fontSize: 15, marginLeft: 8 }}>
                  x{item.quantity}
                </Text>
              </View>

              {item.description && (
                <Text style={{ color: theme.colors.textSecondary, marginTop: 6, fontSize: 14, lineHeight: 20 }}>
                  {item.description}
                </Text>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
                <View style={{ flex: 1 }}>
                  {item.isEssential && (
                    <View style={{
                      backgroundColor: theme.colors.accent + '15',
                      alignSelf: 'flex-start',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: theme.colors.accent + '25'
                    }}>
                      <Text style={{ color: theme.colors.accent, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
                        Essential
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: '#FF525215',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#FF525230'
                  }}
                >
                  <Text style={{ color: '#FF5252', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          // --- FOOTER: DELETE BOX BUTTON ---
          ListFooterComponent={
            <TouchableOpacity
              onPress={handleDeleteBox}
              activeOpacity={0.7}
              style={{
                marginTop: 32,
                marginBottom: 40,
                padding: 16,
                backgroundColor: 'transparent',
                borderRadius: theme.borderRadius,
                borderWidth: 1.5,
                borderColor: '#FF525240', // Muted red border
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FF5252', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
                Delete Entire Box
              </Text>
            </TouchableOpacity>
          }
        />
      </View>
    </>
  );
}
