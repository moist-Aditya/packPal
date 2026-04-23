import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { searchItems } from '@/db/helpers/items';
import { theme } from '@/theme'; // Importing your dark theme
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useDebounce } from '@/utils/useDebounce';

export default function ItemsScreen() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    const res = await searchItems(text);
    setItems(res);
  };

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  useFocusEffect(
    useCallback(() => {
      handleSearch(query);
    }, [query])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m }}>
      {/* 🔍 Modern Search Bar */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          placeholder="Search all items..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 16,
            borderRadius: 14,
            color: theme.colors.textPrimary,
            fontSize: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        />
      </View>

      {/* 📦 List */}
      {items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>
            No items match your search 🔎
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/boxes/${item.boxId}`)}
            >
              <View
                style={{
                  padding: 16,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{
                    fontWeight: '700',
                    fontSize: 17,
                    color: theme.colors.textPrimary
                  }}>
                    {item.name}
                  </Text>
                  <Text style={{
                    color: theme.colors.accent,
                    fontWeight: '700',
                    fontSize: 14
                  }}>
                    x{item.quantity}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  gap: 6
                }}>
                  <Text style={{ fontSize: 14, color: theme.colors.primary }}>📦</Text>
                  <Text style={{
                    color: theme.colors.textSecondary,
                    fontSize: 14,
                    fontWeight: '500'
                  }}>
                    In {item.boxLabel}
                  </Text>
                </View>

                {item.isEssential && (
                  <View style={{
                    marginTop: 10,
                    backgroundColor: theme.colors.accent + '15',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: theme.colors.accent + '30'
                  }}>
                    <Text style={{
                      color: theme.colors.accent,
                      fontSize: 10,
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      Essential
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}