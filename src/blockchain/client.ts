import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
} from 'viem';
import type { Address } from 'viem';
import { DEFAULT_CHAIN } from './networks';

export const publicClient = createPublicClient({
  chain: DEFAULT_CHAIN,
  transport: http(undefined, {
    timeout: 10000,
    retryCount: 2,
  }),
});

export async function getNetworkBlockNumber(): Promise<bigint> {
  return publicClient.getBlockNumber();
}

export async function getWalletBalance(
  address: string
): Promise<string> {
  if (!isAddress(address)) {
    throw new Error('Invalid Ethereum wallet address');
  }

  const balance = await publicClient.getBalance({
    address: address as Address,
  });

  return formatEther(balance);
}
