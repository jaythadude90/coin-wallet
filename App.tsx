import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { DEFAULT_CHAIN } from './src/blockchain/networks';
import { getNetworkBlockNumber } from './src/blockchain/client';

export default function App() {
  const [block, setBlock] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkNetwork() {
    setLoading(true);
    setError(null);

    try {
      const latestBlock = await getNetworkBlockNumber();
      setBlock(latestBlock.toString());
    } catch {
      setError('Unable to connect to Sepolia. Check your network or RPC provider.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void checkNetwork();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CoinWallet</Text>
      <Text style={styles.subtitle}>Secure Wallet Development</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Network</Text>
        <Text style={styles.value}>{DEFAULT_CHAIN.name}</Text>

        <Text style={styles.label}>Chain ID</Text>
        <Text style={styles.value}>{DEFAULT_CHAIN.id}</Text>

        <Text style={styles.label}>Latest Block</Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.value}>{block ?? 'Not connected'}</Text>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.button} onPress={checkNetwork} disabled={loading}>
          <Text style={styles.buttonText}>Refresh Network</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        Sepolia Testnet Only — No Real Funds
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 36,
  },
  card: {
    backgroundColor: '#172235',
    borderRadius: 18,
    padding: 24,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 16,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 4,
  },
  error: {
    color: '#F87171',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 14,
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 30,
  },
});
