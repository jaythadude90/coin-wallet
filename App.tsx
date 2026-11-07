import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { isAddress } from 'viem';
import { sepolia } from 'viem/chains';
import {
  getNetworkBlockNumber,
  getWalletBalance,
} from './src/blockchain/client';

export default function App() {
  const [block, setBlock] = useState('Connecting...');
  const [networkLoading, setNetworkLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [error, setError] = useState('');

  async function refreshNetwork() {
    setNetworkLoading(true);
    try {
      const latest = await getNetworkBlockNumber();
      setBlock(latest.toString());
    } catch {
      setBlock('Connection unavailable');
    } finally {
      setNetworkLoading(false);
    }
  }

  async function checkBalance() {
    const input = address.trim();
    setBalance(null);
    setError('');

    if (!isAddress(input)) {
      setError('Enter a valid Ethereum wallet address.');
      return;
    }

    Keyboard.dismiss();
    setBalanceLoading(true);

    try {
      const result = await getWalletBalance(input);
      setBalance(result);
    } catch {
      setError('Balance lookup failed. Check your connection and retry.');
    } finally {
      setBalanceLoading(false);
    }
  }

  useEffect(() => {
    void refreshNetwork();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>CoinWallet</Text>
        <Text style={styles.subtitle}>Your Crypto. Your Control.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>NETWORK</Text>
          <Text style={styles.value}>{sepolia.name}</Text>

          <Text style={styles.label}>CHAIN ID</Text>
          <Text style={styles.value}>{sepolia.id}</Text>

          <Text style={styles.label}>LATEST BLOCK</Text>
          {networkLoading ? (
            <ActivityIndicator color="#38BDF8" />
          ) : (
            <Text style={styles.value}>{block}</Text>
          )}

          <Pressable
            style={styles.button}
            onPress={() => void refreshNetwork()}
            disabled={networkLoading}
          >
            <Text style={styles.buttonText}>Refresh Network</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wallet Balance</Text>
          <Text style={styles.description}>
            Enter a public Ethereum address to check its Sepolia ETH balance.
          </Text>

          <TextInput
            style={styles.input}
            value={address}
            onChangeText={(value) => {
              setAddress(value);
              setBalance(null);
              setError('');
            }}
            placeholder="0x..."
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            accessibilityLabel="Public Ethereum address"
          />

          <Pressable
            style={[
              styles.button,
              balanceLoading && styles.disabled,
            ]}
            onPress={() => void checkBalance()}
            disabled={balanceLoading}
          >
            <Text style={styles.buttonText}>
              {balanceLoading ? 'Checking...' : 'Check Balance'}
            </Text>
          </Pressable>

          {balanceLoading && (
            <ActivityIndicator
              color="#38BDF8"
              style={styles.indicator}
            />
          )}

          {balance !== null && (
            <View style={styles.result}>
              <Text style={styles.label}>SEPOLIA ETH BALANCE</Text>
              <Text style={styles.balance}>{balance} ETH</Text>
            </View>
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>

        <Text style={styles.footer}>
          SEPOLIA TESTNET ONLY — NO REAL FUNDS
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F1F',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#152238',
    padding: 22,
    borderRadius: 20,
    marginBottom: 18,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 14,
    letterSpacing: 1,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 21,
  },
  input: {
    backgroundColor: '#080F1F',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
  indicator: {
    marginTop: 16,
  },
  result: {
    marginTop: 18,
  },
  balance: {
    color: '#38BDF8',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  error: {
    color: '#F87171',
    marginTop: 16,
  },
  footer: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
  },
});
