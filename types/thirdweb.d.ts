declare module 'thirdweb' {
  export interface ThirdwebClientOptions {
    clientId?: string;
    clientSecret?: string;
    [key: string]: any;
  }
  
  export function createThirdwebClient(options: ThirdwebClientOptions): any;
  
  export interface Contract {
    address: string;
    abi: readonly any[] | any[];
    chain: any;
    client: any;
  }
  
  export interface ReadContractOptions {
    contract: Contract;
    method: string;
    params?: any[];
  }
  
  export interface PrepareContractCallOptions {
    contract: Contract;
    method: string;
    params?: any[];
    value?: bigint;
  }
  
  export interface SendTransactionOptions {
    transaction: any;
    account: any;
  }
  
  export function getContract(options: {
    client: any;
    chain: any;
    address: string;
    abi: any[];
  }): Contract;
  
  export function readContract(options: ReadContractOptions): Promise<any>;
  
  export function prepareContractCall(options: PrepareContractCallOptions): any;
  
  export function sendTransaction(options: SendTransactionOptions): Promise<any>;
  
  // Re-export from thirdweb/react for convenience
  export * from 'thirdweb/react';
}

declare module 'thirdweb/react' {
  import { ReactNode, ComponentType } from 'react';
  
  export interface ThirdwebProviderProps {
    client: any;
    children: ReactNode;
  }
  
  export const ThirdwebProvider: ComponentType<ThirdwebProviderProps>;
  export const ConnectButton: ComponentType<any>;
  export const useActiveAccount: () => any;
  export const useActiveWallet: () => any;
  
  export interface UseReadContractOptions {
    contract: any;
    method: string;
    params?: any[];
  }
  
  export interface UseSendTransactionResult {
    mutate: (transaction: any) => void;
    isPending: boolean;
    isError: boolean;
    error: any;
    data: any;
  }
  
  export function useReadContract(options: UseReadContractOptions): {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  
  export function useSendTransaction(): UseSendTransactionResult;
}

declare module 'thirdweb/wallets' {
  export interface InAppWalletOptions {
    executionMode?: {
      mode?: string;
      sponsorGas?: boolean;
    };
    [key: string]: any;
  }
  
  export function inAppWallet(options?: InAppWalletOptions): any;
}

