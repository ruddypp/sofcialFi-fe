"use client";

import { thirdwebClient } from "@/app/config";
import { defineChain } from "thirdweb/chains";
import { PETITION_PLATFORM_ABI } from "./petitionPlatform";
import { CAMPAIGN_TOKEN_ABI } from "./campaignToken";
import { NFT_ABI } from "./soulboundToken";
import { CONTRACT_ADDRESSES } from "./contracts";

// Define Lisk Sepolia chain
export const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Lisk Sepolia ETH",
    symbol: "LSK",
    decimals: 18,
  },
  rpc: "https://rpc.sepolia-api.lisk.com",
});

// Contract configuration objects
export const petitionPlatformContract = {
  address: CONTRACT_ADDRESSES.PETITION_PLATFORM,
  abi: PETITION_PLATFORM_ABI,
  chain: liskSepolia,
  client: thirdwebClient,
};

export const campaignTokenContract = {
  address: CONTRACT_ADDRESSES.CAMPAIGN_TOKEN,
  abi: CAMPAIGN_TOKEN_ABI,
  chain: liskSepolia,
  client: thirdwebClient,
};

export const soulboundMemberContract = {
  address: CONTRACT_ADDRESSES.SOULBOUND_MEMBER,
  abi: NFT_ABI,
  chain: liskSepolia,
  client: thirdwebClient,
};

// Export contract configs for use in hooks

