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

export default function ItemsScreen() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);

    const res = await searchItems(text);
    setItems(res);
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* 🔍 Search */}
      <TextInput
        placeholder="Search items..."
        value={query}
        onChangeText={handleSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 10,
          marginBottom: 16,
        }}
      />

      {/* 📦 List */}
      {items.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text>No items found</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/boxes/${item.boxId}`)}
            >
              <View
                style={{
                  padding: 12,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: '600' }}>
                  {item.name} (x{item.quantity})
                </Text>

                <Text style={{ color: '#666' }}>
                  📦 {item.boxLabel}
                </Text>

                {item.isEssential && (
                  <Text style={{ color: 'red', marginTop: 4 }}>
                    Essential
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}