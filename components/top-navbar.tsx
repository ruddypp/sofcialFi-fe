"use client"
import { Bell, Wallet, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { thirdwebClient } from "@/app/config";
import { inAppWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import { TokenBalance } from "@/components/token-balance";

// Define Lisk Sepolia chain
const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Lisk Sepolia ETH",
    symbol: "LSK",
    decimals: 18,
  },
  rpc: "https://rpc.sepolia-api.lisk.com",
});

const wallet = inAppWallet({
  // enable gasless transactions for the wallet
  executionMode: {
    mode: "EIP7702",
    sponsorGas: true
  }, 
  chain: liskSepolia
});
 
export function TopNavbar() {
  return (
    <header className="h-16 border-b border-border bg-card/50 glass-dark flex items-center justify-between px-8">
      {/* Left side - Page title/breadcrumbs placeholder */}
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-xs text-muted-foreground">Welcome back to Impact-Chain</p>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Network indicator */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <Network size={16} className="text-primary" />
          <span className="text-sm text-foreground">Lisk Sepolia</span>
        </div>

        {/* Token Balance */}
        <TokenBalance />

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Wallet Connect Button */}
        <div className="[&_button]:h-9 [&_button]:rounded-lg [&_button]:bg-gradient-to-r [&_button]:from-primary [&_button]:to-accent [&_button]:text-primary-foreground [&_button]:border-0 [&_button]:px-4 [&_button]:font-medium [&_button]:hover:opacity-90 [&_button]:transition-all">
          <ConnectButton 
            client={thirdwebClient}
            chain={liskSepolia}
            connectButton={{
              label: "Connect Wallet",
            }}
            connectModal={{
              size: "wide",
            }}
          />
        </div>
      </div>
    </header>
  );
}
