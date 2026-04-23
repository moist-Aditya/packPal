import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boxSchema, BoxFormData } from '@/types/box';
import { createBox } from '@/db/helpers/boxes';

export default function AddBoxScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BoxFormData>({
    resolver: zodResolver(boxSchema),
  });

  const onSubmit = async (data: BoxFormData) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);

    await createBox({
      id,
      label: data.label,
      category: data.category,
      createdAt: new Date(),
    });

    router.back(); // go back to boxes list
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Add Box</Text>

      {/* Label */}
      <View>
        <Text>Label</Text>
        <Controller
          control={control}
          name="label"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Box 1"
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
        {errors.label && <Text style={{ color: 'red' }}>{errors.label.message}</Text>}
      </View>

      {/* Category */}
      <View>
        <Text>Category (optional)</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Kitchen, Bedroom..."
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
        <Text style={{ color: '#fff', fontWeight: '600' }}>Create Box</Text>
      </TouchableOpacity>
    </View>
  );
}
