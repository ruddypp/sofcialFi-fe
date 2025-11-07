"use client";

import { useActiveAccount } from "thirdweb/react";
import { useHasMintedSBT, useMintSBT } from "@/hooks/use-contracts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SBTRegistration() {
  const account = useActiveAccount();
  const { data: hasMinted, isLoading: checkingMint } = useHasMintedSBT(account?.address || "");
  const { write: mintSBT, isPending: isMinting } = useMintSBT();

  const handleMint = () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    mintSBT("mintMembership", [], undefined);
    toast.success("Minting SBT... Please confirm the transaction");
  };

  if (!account) {
    return (
      <Card className="glass-dark border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-primary" size={24} />
            Become a Member
          </CardTitle>
          <CardDescription>Connect your wallet to register and get your Soulbound Token</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please connect your wallet to continue</p>
        </CardContent>
      </Card>
    );
  }

  if (checkingMint) {
    return (
      <Card className="glass-dark border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-primary" size={20} />
            <span className="text-muted-foreground">Checking membership status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasMinted) {
    return (
      <Card className="glass-dark border-primary/20 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-primary" size={24} />
            You're a Member!
          </CardTitle>
          <CardDescription>You have successfully registered with your Soulbound Token</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/50">
              <Shield size={14} className="mr-1" />
              Verified Member
            </Badge>
            <div className="p-4 rounded-lg bg-muted/30 border border-primary/20">
              <p className="text-sm font-medium mb-2">Member Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>1 free CampaignToken to create your first petition</li>
                <li>Ability to sign and create petitions</li>
                <li>One wallet, one voice - verified identity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-dark border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="text-primary" size={24} />
          Register as Member
        </CardTitle>
        <CardDescription>
          Get your Soulbound Token (SBT) to participate in the platform. This is a one-time registration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/30 border border-primary/20">
          <p className="text-sm font-medium mb-2">What is a Soulbound Token (SBT)?</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Non-transferable digital identity token</li>
            <li>One per wallet - prevents fake identities</li>
            <li>Required to create or sign petitions</li>
            <li>Free to mint - no gas fees (sponsored by Lisk)</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-sm font-medium mb-2 text-primary">After Registration:</p>
          <p className="text-sm text-muted-foreground">
            You'll automatically receive 1 CampaignToken (ERC-20) that you can use to create your first petition for free!
          </p>
        </div>

        <Button
          onClick={handleMint}
          disabled={isMinting}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isMinting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              Minting SBT...
            </>
          ) : (
            <>
              <Shield className="mr-2" size={20} />
              Mint My Soulbound Token
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          This transaction is gasless - no fees required!
        </p>
      </CardContent>
    </Card>
  );
}


