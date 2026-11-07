import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
} from 'viem';
import type { Address } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://ethereum-sepolia-rpc.publicnode.com', {
    timeout: 15000,
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
    throw new Error('Invalid Ethereum address');
  }

  const balance = await publicClient.getBalance({
    address: address as Address,
  });

  return formatEther(balance);
}
