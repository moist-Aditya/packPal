import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { itemSchema, ItemFormData } from '@/types/items';
import { createItem } from '@/db/helpers/items';

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
      quantity: data.quantity,
      boxId: id,
      isEssential: data.isEssential,
      createdAt: new Date(),
    });

    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Add Item</Text>

      {/* Name */}
      <View>
        <Text>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Charger"
              value={value}
              onChangeText={onChange}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 8,
                marginTop: 4,
              }}
            />
          )}
        />
        {errors.name && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}
      </View>

      {/* Quantity */}
      <View>
        <Text>Quantity</Text>
        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, value } }) => (
            <TextInput
              keyboardType="numeric"
              value={String(value)}
              onChangeText={(text) => onChange(text)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 8,
                marginTop: 4,
              }}
            />
          )}
        />
        {errors.quantity && <Text style={{ color: 'red' }}>{errors.quantity.message}</Text>}
      </View>

      {/* Description */}
      <View>
        <Text>Description (optional)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="White USB-C cable"
              value={value}
              onChangeText={onChange}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 8,
                marginTop: 4,
              }}
            />
          )}
        />
      </View>

      {/* Essential Toggle */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text>Mark as Essential</Text>
        <Controller
          control={control}
          name="isEssential"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} />
          )}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={{
          backgroundColor: '#000',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}
