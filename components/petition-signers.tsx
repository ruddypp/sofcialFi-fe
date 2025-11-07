"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Copy, CheckCircle2 } from "lucide-react";
import { useGetPetitionSigners } from "@/hooks/use-petition-signers";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PetitionSignersProps {
  petitionId: number;
}

export function PetitionSigners({ petitionId }: PetitionSignersProps) {
  const { signers, isLoading, error } = useGetPetitionSigners(petitionId);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Card className="glass-dark border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Signers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-dark border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Signers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load signers</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-dark border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Signers ({signers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {signers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No one has signed this petition yet. Be the first!
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {signers.map((address, index) => (
              <div
                key={address}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <code className="text-sm font-mono text-foreground break-all">
                      {address}
                    </code>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(address)}
                  className="shrink-0"
                >
                  {copiedAddress === address ? (
                    <CheckCircle2 size={16} className="text-primary" />
                  ) : (
                    <Copy size={16} className="text-muted-foreground" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

