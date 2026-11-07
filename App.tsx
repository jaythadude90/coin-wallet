import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { sepolia } from 'viem/chains';
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  chain: sepolia,
  transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
});

export default function App() {
  const [block, setBlock] = useState('Connecting...');
  const [loading, setLoading] = useState(false);

  async function refreshNetwork() {
    setLoading(true);

    try {
      const latest = await client.getBlockNumber();
      setBlock(latest.toString());
    } catch {
      setBlock('Connection unavailable');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshNetwork();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CoinWallet</Text>
      <Text style={styles.subtitle}>Your Crypto. Your Control.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>NETWORK</Text>
        <Text style={styles.value}>Ethereum Sepolia</Text>

        <Text style={styles.label}>CHAIN ID</Text>
        <Text style={styles.value}>11155111</Text>

        <Text style={styles.label}>LATEST BLOCK</Text>
        {loading ? (
          <ActivityIndicator color="#38BDF8" />
        ) : (
          <Text style={styles.value}>{block}</Text>
        )}

        <Pressable
          style={styles.button}
          onPress={refreshNetwork}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Refresh Network</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        TESTNET MODE — NO REAL FUNDS
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F1F',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 35,
  },
  card: {
    backgroundColor: '#152238',
    padding: 24,
    borderRadius: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 20,
    letterSpacing: 1,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 28,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
  footer: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 12,
  },
});
