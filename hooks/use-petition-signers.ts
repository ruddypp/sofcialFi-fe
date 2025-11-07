"use client";

import { useEffect, useState } from "react";
import { petitionPlatformContract } from "@/lib/contract-utils";
import { liskSepolia } from "@/lib/contract-utils";

/**
 * Hook to get all signers of a petition by reading PetitionSigned events
 * Event signature: PetitionSigned(uint256 indexed,address indexed,uint256)
 */
export function useGetPetitionSigners(petitionId: number | undefined) {
  const [signers, setSigners] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSigners() {
      if (petitionId === undefined || petitionId === null) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const contractAddress = petitionPlatformContract.address;
        const rpcUrl = liskSepolia.rpc || "https://rpc.sepolia-api.lisk.com";
        
        // Convert petitionId to hex with padding (64 chars = 32 bytes)
        const petitionIdHex = "0x" + BigInt(petitionId).toString(16).padStart(64, "0");
        
        // Query events using eth_getLogs
        // Event structure: PetitionSigned(uint256 indexed, address indexed, uint256)
        // Topics: [eventSignature, petitionId, signer]
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getLogs",
            params: [
              {
                address: contractAddress.toLowerCase(),
                topics: [
                  null, // Any event - we'll filter by petitionId
                  petitionIdHex, // Filter by petitionId (first indexed parameter)
                ],
                fromBlock: "0x0",
                toBlock: "latest",
              },
            ],
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          // If error, log it but don't fail completely
          console.warn("Error fetching events:", data.error);
          // Try to continue with empty array
          setSigners([]);
          setIsLoading(false);
          return;
        }

        if (!data.result || data.result.length === 0) {
          setSigners([]);
          setIsLoading(false);
          return;
        }

        // Extract signers from topics
        // For PetitionSigned event:
        // topics[0] = event signature hash
        // topics[1] = petitionId (indexed uint256, padded to 64 hex chars)
        // topics[2] = signer address (indexed address, padded to 64 hex chars, address is last 40 chars)
        const uniqueSigners = new Set<string>();
        
        for (const log of data.result) {
          if (log.topics && log.topics.length >= 3) {
            // Extract address from topics[2]
            // Address is stored in the last 40 characters (20 bytes)
            const signerTopic = log.topics[2];
            if (signerTopic && typeof signerTopic === "string" && signerTopic.startsWith("0x")) {
              // Get last 40 characters for the address
              const address = "0x" + signerTopic.slice(-40).toLowerCase();
              // Validate it's a valid address format
              if (/^0x[a-f0-9]{40}$/.test(address)) {
                uniqueSigners.add(address);
              }
            }
          }
        }

        // Convert to array and sort
        const signersArray = Array.from(uniqueSigners).sort();
        setSigners(signersArray);
      } catch (err) {
        console.error("Error fetching petition signers:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setSigners([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSigners();
    
    // Optional: Refresh every 30 seconds to get new signers
    const interval = setInterval(fetchSigners, 30000);
    return () => clearInterval(interval);
  }, [petitionId]);

  return { signers, isLoading, error };
}
