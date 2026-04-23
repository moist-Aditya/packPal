import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { getAllBoxes } from '@/db/helpers/boxes';
import { theme } from '@/theme'; // Importing your theme

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

  useFocusEffect(
    useCallback(() => {
      fetchBoxes();
    }, [])
  );

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Your Boxes',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push('/boxes/add')}
                style={{ marginRight: 8 }}
              >
                <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
                  + Add
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </>
    );
  }

  // 📭 EMPTY STATE
  if (boxes.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Your Boxes',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push('/boxes/add')}
                style={{ marginRight: 8 }}
              >
                <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
                  + Add
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing.m,
          backgroundColor: theme.colors.background
        }}>
          <Text style={{ fontSize: 20, color: theme.colors.textSecondary, fontWeight: '300' }}>
            No boxes yet 📦
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/boxes/add')}
            style={{
              paddingVertical: 14,
              paddingHorizontal: 28,
              backgroundColor: theme.colors.accent, // Walnut highlight
              borderRadius: theme.borderRadius,
            }}>
            <Text style={{ color: theme.colors.background, fontWeight: '700', letterSpacing: 0.5 }}>
              Start Packing
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // 📦 LIST
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack.Screen
        options={{
          title: 'Your Boxes',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/boxes/add')}
              style={{ marginRight: 8 }}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
                + Add
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={boxes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: theme.spacing.m,
          paddingBottom: 80,
          gap: theme.spacing.m
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/boxes/${item.id}`)}
          >
            <View
              style={{
                padding: 20,
                borderRadius: theme.borderRadius,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                // Soft elevation
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3,
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: theme.colors.textPrimary,
                    marginBottom: 4
                  }}>
                    {item.label}
                  </Text>
                  {item.category && (
                    <Text style={{ color: theme.colors.accent, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {item.category}
                    </Text>
                  )}
                </View>

                <View style={{
                  backgroundColor: item.isUnpacked ? theme.colors.success + '20' : theme.colors.primary + '20',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: item.isUnpacked ? theme.colors.success : theme.colors.primary,
                    fontWeight: '600'
                  }}>
                    {item.isUnpacked ? 'UNPACKED' : 'PACKED'}
                  </Text>
                </View>
              </View>

              <View style={{
                marginTop: 16,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                  Created {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}