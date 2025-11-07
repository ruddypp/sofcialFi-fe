"use client";

import { useActiveAccount } from "thirdweb/react";
import { useGetCampaignTokenBalance } from "@/hooks/use-contracts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Loader2 } from "lucide-react";

export function TokenBalance() {
  const account = useActiveAccount();
  const { data: balance, isLoading } = useGetCampaignTokenBalance(account?.address || "");

  if (!account) {
    return null;
  }

  // Convert from wei (18 decimals) to readable format
  const tokenBalance = balance 
    ? Number(balance) / 1e18 
    : 0;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-primary/20">
      <Coins size={16} className="text-primary" />
      {isLoading ? (
        <Loader2 className="animate-spin text-primary" size={14} />
      ) : (
        <>
          <span className="text-sm font-medium text-foreground">
            {tokenBalance.toFixed(2)} CAMP
          </span>
          {tokenBalance > 0 && (
            <Badge className="bg-primary/20 text-primary border-primary/50 text-xs ml-1">
              Free Petition Available
            </Badge>
          )}
        </>
      )}
    </div>
  );
}

