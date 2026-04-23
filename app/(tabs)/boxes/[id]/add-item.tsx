import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { itemSchema, ItemFormData } from '@/types/items';
import { createItem } from '@/db/helpers/items';
import { theme } from '@/theme'; // Import your custom theme

export default function AddItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // boxId

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues: {
      quantity: 1,
      isEssential: false,
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    if (!id) return;

    const newId = Date.now().toString() + Math.random().toString(36).slice(2);

    await createItem({
      id: newId,
      name: data.name,
      description: data.description,
      quantity: Number(data.quantity), // Ensure numeric
      boxId: id,
      isEssential: data.isEssential,
      createdAt: new Date(),
    });

    router.back();
  };

  const inputStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    color: theme.colors.textPrimary,
    marginTop: 6,
    fontSize: 16,
  };

  const labelStyle = {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  };

  return (
    <>
      <Stack.Screen options={{
        title: ""
      }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ padding: theme.spacing.m, gap: 20 }}
      >
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.colors.textPrimary,
          marginBottom: 8
        }}>
          Add Item
        </Text>

        {/* Name */}
        <View>
          <Text style={labelStyle}>Item Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="e.g. Mechanical Keyboard"
                placeholderTextColor="#555"
                value={value}
                onChangeText={onChange}
                style={inputStyle}
              />
            )}
          />
          {errors.name && (
            <Text style={{ color: '#E57373', marginTop: 4, marginLeft: 4 }}>
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Quantity */}
        <View>
          <Text style={labelStyle}>Quantity</Text>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, value } }) => (
              <TextInput
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="#555"
                value={String(value)}
                onChangeText={onChange}
                style={inputStyle}
              />
            )}
          />
          {errors.quantity && (
            <Text style={{ color: '#E57373', marginTop: 4, marginLeft: 4 }}>
              {errors.quantity.message}
            </Text>
          )}
        </View>

        {/* Description */}
        <View>
          <Text style={labelStyle}>Notes (optional)</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Walnut finish, fragile..."
                placeholderTextColor="#555"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
              />
            )}
          />
        </View>

        {/* Essential Toggle Card */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}>
          <View>
            <Text style={{ color: theme.colors.textPrimary, fontWeight: '600', fontSize: 16 }}>
              Essential Item
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
              Unpack this first at the new house
            </Text>
          </View>
          <Controller
            control={control}
            name="isEssential"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#3E3E3E', true: theme.colors.primary + '60' }}
                thumbColor={value ? theme.colors.primary : '#f4f3f4'}
              />
            )}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          style={{
            backgroundColor: theme.colors.accent, // Walnut color
            padding: 16,
            borderRadius: theme.borderRadius,
            alignItems: 'center',
            marginTop: 10,
            shadowColor: theme.colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}>
          <Text style={{
            color: theme.colors.background,
            fontWeight: '700',
            fontSize: 16,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            Add to Box
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}