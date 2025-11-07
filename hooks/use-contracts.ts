"use client";

import { useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { petitionPlatformContract, campaignTokenContract, soulboundMemberContract } from "@/lib/contract-utils";

// Type assertion untuk contract configs
const petitionContract = petitionPlatformContract as any;
const campaignContract = campaignTokenContract as any;
const soulboundContract = soulboundMemberContract as any;

// ==================== READ HOOKS ====================

/**
 * Hook to read from PetitionPlatform contract
 */
export function useReadPetitionPlatform(functionName: string, params: any[] = []) {
  return useReadContract({
    contract: petitionContract,
    method: functionName,
    params,
  });
}

/**
 * Hook to read from CampaignToken contract
 */
export function useReadCampaignToken(functionName: string, params: any[] = []) {
  return useReadContract({
    contract: campaignContract,
    method: functionName,
    params,
  });
}

/**
 * Hook to read from SoulboundMember contract
 */
export function useReadSoulboundMember(functionName: string, params: any[] = []) {
  return useReadContract({
    contract: soulboundContract,
    method: functionName,
    params,
  });
}

// ==================== WRITE HOOKS ====================

/**
 * Hook to send transaction to PetitionPlatform
 */
export function useWritePetitionPlatform() {
  const { mutate: sendTransaction, isPending, isError, error } = useSendTransaction();
  
  const write = (functionName: string, params: any[] = [], value?: bigint) => {
    const transaction = prepareContractCall({
      contract: petitionContract,
      method: functionName,
      params,
      value,
    });
    sendTransaction(transaction);
  };
  
  return { write, isPending, isError, error };
}

/**
 * Hook to send transaction to CampaignToken
 */
export function useWriteCampaignToken() {
  const { mutate: sendTransaction, isPending, isError, error } = useSendTransaction();
  
  const write = (functionName: string, params: any[] = [], value?: bigint) => {
    const transaction = prepareContractCall({
      contract: campaignContract,
      method: functionName,
      params,
      value,
    });
    sendTransaction(transaction);
  };
  
  return { write, isPending, isError, error };
}

/**
 * Hook to send transaction to SoulboundMember
 */
export function useWriteSoulboundMember() {
  const { mutate: sendTransaction, isPending, isError, error } = useSendTransaction();
  
  const write = (functionName: string, params: any[] = [], value?: bigint) => {
    const transaction = prepareContractCall({
      contract: soulboundContract,
      method: functionName,
      params,
      value,
    });
    sendTransaction(transaction);
  };
  
  return { write, isPending, isError, error };
}

// ==================== SPECIFIC HOOKS ====================

/**
 * Get all petitions
 */
export function useGetAllPetitions() {
  return useReadPetitionPlatform("getAllPetitions", []);
}

/**
 * Get active boosted petitions
 */
export function useGetActiveBoostedPetitions() {
  return useReadPetitionPlatform("getActiveBoostedPetitions", []);
}

/**
 * Get a specific petition by ID
 */
export function useGetPetition(petitionId: number) {
  return useReadPetitionPlatform("getPetition", [petitionId]);
}

/**
 * Get total number of petitions
 */
export function useGetTotalPetitions() {
  return useReadPetitionPlatform("getTotalPetitions", []);
}

/**
 * Check if user has signed a petition
 */
export function useHasUserSigned(petitionId: number, userAddress: string) {
  return useReadPetitionPlatform("hasUserSigned", [petitionId, userAddress]);
}

/**
 * Get user's paid petition count
 */
export function useGetUserPaidPetitionCount(userAddress: string) {
  return useReadPetitionPlatform("getUserPaidPetitionCount", [userAddress]);
}

/**
 * Get pricing info
 */
export function useGetPricingInfo() {
  return useReadPetitionPlatform("getPricingInfo", []);
}

/**
 * Get campaign token balance
 */
export function useGetCampaignTokenBalance(address: string) {
  return useReadCampaignToken("balanceOf", [address]);
}

/**
 * Check if user has soulbound NFT
 */
export function useHasSoulboundNFT(userAddress: string) {
  return useReadSoulboundMember("balanceOf", [userAddress]);
}

/**
 * Check if user has minted SBT
 */
export function useHasMintedSBT(userAddress: string) {
  return useReadSoulboundMember("hasMinted", [userAddress]);
}

/**
 * Check if user is a member
 */
export function useIsMember(userAddress: string) {
  return useReadSoulboundMember("isMember", [userAddress]);
}

/**
 * Hook to mint SBT membership
 */
export function useMintSBT() {
  return useWriteSoulboundMember();
}

/**
 * Hook to create a petition
 */
export function useCreatePetition() {
  return useWritePetitionPlatform();
}

/**
 * Hook to sign a petition
 */
export function useSignPetition() {
  return useWritePetitionPlatform();
}

/**
 * Hook to boost a petition
 */
export function useBoostPetition() {
  return useWritePetitionPlatform();
}

