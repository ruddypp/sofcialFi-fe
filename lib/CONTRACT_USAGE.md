# Contract Read & Write Guide

File ini menjelaskan cara menggunakan fungsi read dan write untuk kontrak smart contract.

## File yang Dibuat

1. **`lib/contracts.ts`** - Berisi alamat kontrak
2. **`lib/contract-utils.ts`** - Konfigurasi kontrak dan chain
3. **`hooks/use-contracts.ts`** - React hooks untuk read/write

## Contract Addresses

- **CampaignToken**: `0x7D3e8350c2a87b9d61816975CFe0cd18CC4e7B30`
- **SoulboundMember**: `0x9F090D06638f7d32915065d51BE2E737b8E6bDaB`
- **PetitionPlatform**: `0x4Ec2EEc9D8071DBB9e4ba332e93d6624fF614D8b`

## Cara Menggunakan

### 1. READ Operations (Tidak Mengubah State)

```tsx
import { useGetAllPetitions, useGetPetition, useGetPricingInfo } from "@/hooks/use-contracts";

function MyComponent() {
  // Read semua petitions
  const { data: petitions, isLoading } = useGetAllPetitions();
  
  // Read petition spesifik
  const { data: petition } = useGetPetition(1);
  
  // Read pricing info
  const { data: pricing } = useGetPricingInfo();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### 2. WRITE Operations (Mengubah State)

```tsx
import { useCreatePetition, useSignPetition, useBoostPetition } from "@/hooks/use-contracts";
import { useActiveAccount } from "thirdweb/react";

function CreatePetitionForm() {
  const { write, isPending, isError, error } = useCreatePetition();
  const account = useActiveAccount();
  
  const handleCreate = () => {
    // createPetition(title, description, imageHash, useToken)
    write("createPetition", [
      "My Petition Title",
      "My Petition Description", 
      "ipfs://hash",
      false
    ]);
  };
  
  return (
    <button onClick={handleCreate} disabled={isPending}>
      {isPending ? "Creating..." : "Create Petition"}
    </button>
  );
}
```

### 3. Custom Read Operations

```tsx
import { useReadPetitionPlatform } from "@/hooks/use-contracts";

function MyComponent() {
  const { data, isLoading } = useReadPetitionPlatform("getTotalPetitions", []);
  
  return <div>Total: {data?.toString()}</div>;
}
```

### 4. Custom Write Operations

```tsx
import { useWritePetitionPlatform } from "@/hooks/use-contracts";

function MyComponent() {
  const { write, isPending } = useWritePetitionPlatform();
  
  const handleSign = () => {
    // signPetition(petitionId)
    write("signPetition", [1]);
  };
  
  return <button onClick={handleSign}>Sign Petition</button>;
}
```

## Available Hooks

### Read Hooks (PetitionPlatform)
- `useGetAllPetitions()` - Get semua petitions
- `useGetActiveBoostedPetitions()` - Get active boosted petitions
- `useGetPetition(petitionId)` - Get petition by ID
- `useGetTotalPetitions()` - Get total count
- `useHasUserSigned(petitionId, userAddress)` - Check if user signed
- `useGetUserPaidPetitionCount(userAddress)` - Get user's paid count
- `useGetPricingInfo()` - Get pricing configuration

### Read Hooks (CampaignToken)
- `useGetCampaignTokenBalance(address)` - Get token balance

### Read Hooks (SoulboundMember)
- `useHasSoulboundNFT(userAddress)` - Check if user has NFT

### Write Hooks
- `useCreatePetition()` - Create new petition
- `useSignPetition()` - Sign a petition
- `useBoostPetition()` - Boost a petition
- `useWritePetitionPlatform()` - Generic write to PetitionPlatform
- `useWriteCampaignToken()` - Generic write to CampaignToken
- `useWriteSoulboundMember()` - Generic write to SoulboundMember

## Contoh Lengkap

```tsx
"use client";

import { useGetAllPetitions, useCreatePetition } from "@/hooks/use-contracts";
import { useActiveAccount } from "thirdweb/react";

export function PetitionsList() {
  const { data: petitions, isLoading } = useGetAllPetitions();
  const { write: createPetition, isPending } = useCreatePetition();
  const account = useActiveAccount();
  
  const handleCreate = () => {
    createPetition("createPetition", [
      "Save the Environment",
      "We need to protect our planet",
      "ipfs://QmHash...",
      false
    ]);
  };
  
  if (isLoading) return <div>Loading petitions...</div>;
  
  return (
    <div>
      <button onClick={handleCreate} disabled={isPending}>
        Create Petition
      </button>
      <ul>
        {petitions?.map((petition: any) => (
          <li key={petition.id}>
            <h3>{petition.title}</h3>
            <p>{petition.description}</p>
            <p>Signatures: {petition.signatureCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Catatan Penting

1. **Pastikan wallet sudah connect** sebelum melakukan write operations
2. **Gunakan `useActiveAccount()`** untuk mendapatkan address user
3. **Handle loading dan error states** untuk UX yang baik
4. **Check ABI** di `lib/` untuk melihat parameter yang diperlukan
5. **Value dalam wei** - Jika mengirim native token, gunakan `value` parameter dalam wei

## Troubleshooting

- **Error: "No active wallet"** - Pastikan user sudah connect wallet
- **Error: "Invalid parameters"** - Check ABI untuk parameter yang benar
- **Transaction pending** - Gunakan `isPending` untuk show loading state

