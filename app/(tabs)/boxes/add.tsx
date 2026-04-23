import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boxSchema, BoxFormData } from '@/types/box';
import { createBox } from '@/db/helpers/boxes';
import { theme } from '@/theme'; // Importing your dark theme

export default function AddBoxScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BoxFormData>({
    resolver: zodResolver(boxSchema) as any,
  });

  const onSubmit = async (data: BoxFormData) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);

    await createBox({
      id,
      label: data.label,
      category: data.category,
      createdAt: new Date(),
    });

    router.back();
  };

  // Reusable modern input style
  const inputStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 14,
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginTop: 6,
  };

  const labelStyle = {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginLeft: 4,
  };

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ padding: theme.spacing.m, gap: 24 }}
      >
        <View style={{ marginBottom: 8 }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            letterSpacing: -0.5
          }}>
            New Box
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 16, marginTop: 4 }}>
            Label your container to stay organized.
          </Text>
        </View>

        {/* Label */}
        <View>
          <Text style={labelStyle}>Box Label</Text>
          <Controller
            control={control}
            name="label"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="e.g. Master Bedroom Books"
                placeholderTextColor="#555"
                value={value}
                onChangeText={onChange}
                style={inputStyle}
              />
            )}
          />
          {errors.label && (
            <Text style={{ color: '#E57373', marginTop: 6, marginLeft: 4, fontSize: 13 }}>
              {errors.label.message}
            </Text>
          )}
        </View>

        {/* Category */}
        <View>
          <Text style={labelStyle}>Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Kitchen, Office, Living Room..."
                placeholderTextColor="#555"
                value={value}
                onChangeText={onChange}
                style={inputStyle}
              />
            )}
          />
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 8, marginLeft: 4, fontStyle: 'italic' }}>
            Tip: Grouping by room makes unpacking much faster.
          </Text>
        </View>

        {/* Submit */}
        <View style={{ marginTop: 'auto', paddingTop: 20 }}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            style={{
              backgroundColor: theme.colors.accent, // Walnut button
              padding: 18,
              borderRadius: theme.borderRadius,
              alignItems: 'center',
              shadowColor: theme.colors.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}>
            <Text style={{
              color: theme.colors.background,
              fontWeight: '800',
              fontSize: 16,
              textTransform: 'uppercase',
              letterSpacing: 1.5
            }}>
              Create Box
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ color: theme.colors.textSecondary, fontWeight: '500' }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}