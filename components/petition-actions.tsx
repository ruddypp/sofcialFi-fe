"use client";

import { useActiveAccount } from "thirdweb/react";
import { useGetPetition, useHasUserSigned, useGetPricingInfo, useSignPetition, useBoostPetition } from "@/hooks/use-contracts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Loader2, CheckCircle, AlertCircle, Vote } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMemo } from "react";

interface PetitionActionsProps {
  petitionId: number;
}

export function PetitionActions({ petitionId }: PetitionActionsProps) {
  const account = useActiveAccount();
  const { data: petition, isLoading: loadingPetition } = useGetPetition(petitionId);
  const { data: hasSigned, isLoading: checkingSigned } = useHasUserSigned(
    petitionId,
    account?.address || ""
  );
  const { data: pricingInfo } = useGetPricingInfo();
  const { write: signPetition, isPending: isSigning } = useSignPetition();
  const { write: boostPetition, isPending: isBoosting } = useBoostPetition();

  const isCreator = useMemo(() => {
    if (!petition || !account) return false;
    return petition.creator?.toLowerCase() === account.address?.toLowerCase();
  }, [petition, account]);

  const isBoosted = useMemo(() => {
    if (!petition) return false;
    return Number(petition.boostEndTime) > Date.now() / 1000;
  }, [petition]);

  const boostFee = pricingInfo?.[1] ? Number(pricingInfo[1]) / 1e18 : 0.001; // Default 0.001 ETH

  const handleSign = () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (isCreator) {
      toast.error("You cannot sign your own petition");
      return;
    }

    if (hasSigned) {
      toast.error("You have already signed this petition");
      return;
    }

    signPetition("signPetition", [petitionId], undefined);
    toast.success("Signing petition... Please confirm the transaction");
  };

  const handleBoost = () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isCreator) {
      toast.error("Only the creator can boost this petition");
      return;
    }

    const value = BigInt(Math.floor(boostFee * 1e18)); // Convert to wei

    boostPetition("boostPetition", [petitionId], value);
    toast.success(`Boosting petition... Paying ${boostFee.toFixed(6)} ETH`);
  };

  if (loadingPetition || checkingSigned) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (!petition) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Petition not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sign Petition Button */}
      {!isCreator && (
        <Button
          onClick={handleSign}
          disabled={isSigning || hasSigned || !account}
          size="lg"
          className={`w-full ${
            hasSigned
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isSigning ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              Signing...
            </>
          ) : hasSigned ? (
            <>
              <CheckCircle className="mr-2" size={20} />
              Already Signed
            </>
          ) : (
            <>
              <Vote className="mr-2" size={20} />
              Sign This Petition
            </>
          )}
        </Button>
      )}

      {/* Boost Button (Creator Only) */}
      {isCreator && (
        <div className="space-y-2">
          {isBoosted && (
            <Alert className="bg-accent/10 border-accent/30">
              <Zap className="h-4 w-4 text-accent" />
              <AlertDescription>
                This petition is currently boosted! Boost expires on{" "}
                {new Date(Number(petition.boostEndTime) * 1000).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleBoost}
            disabled={isBoosting || isBoosted || !account}
            size="lg"
            variant={isBoosted ? "outline" : "default"}
            className={`w-full ${
              isBoosted
                ? "border-accent/50 text-accent"
                : "bg-gradient-to-r from-accent to-primary hover:opacity-90"
            }`}
          >
            {isBoosting ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Boosting...
              </>
            ) : isBoosted ? (
              <>
                <Zap className="mr-2" size={20} />
                Already Boosted
              </>
            ) : (
              <>
                <Zap className="mr-2" size={20} />
                Boost Petition ({boostFee.toFixed(6)} ETH)
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Boost your petition to the top for 7 days
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {Number(petition.signatureCount || 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Signatures</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {new Date(Number(petition.createdAt) * 1000).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">Created</p>
        </div>
        {isBoosted && (
          <div className="text-center">
            <Badge className="bg-accent/20 text-accent border-accent/50">
              <Zap size={10} className="mr-1" />
              Boosted
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}


