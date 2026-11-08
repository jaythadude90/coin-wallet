import * as SecureStore from 'expo-secure-store';

export async function testSecureStore(): Promise<boolean> {
  const key = 'coinwallet_test';
  const value = 'test-value-no-secrets';

  try {
    await SecureStore.setItemAsync(key, value);

    const stored = await SecureStore.getItemAsync(key);

    return stored === value;
  } finally {
    await SecureStore.deleteItemAsync(key);
  }
}
