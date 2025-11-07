"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Share2,
  Users,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PetitionActions } from "@/components/petition-actions"
import { PetitionSigners } from "@/components/petition-signers"
import { useGetPetition } from "@/hooks/use-contracts"
import { Loader2 } from "lucide-react"

interface PetitionDetailProps {
  petitionId: number
}

export function PetitionDetail({ petitionId }: PetitionDetailProps) {
  const { data: petitionData, isLoading } = useGetPetition(petitionId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (!petitionData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Petition not found</p>
      </div>
    )
  }

  // Map contract data to component format
  const petition = {
    id: Number(petitionData.id),
    title: petitionData.title || "Untitled Petition",
    description: petitionData.description || "",
    supporters: Number(petitionData.signatureCount || 0),
    image: petitionData.imageHash || "",
    createdDate: new Date(Number(petitionData.createdAt) * 1000).toLocaleDateString(),
    creator: petitionData.creator || "0x...",
    creatorImage: petitionData.creator?.slice(2, 4).toUpperCase() || "XX",
    momentum: `+${Number(petitionData.signatureCount || 0)} signatures`,
    isBoosted: Number(petitionData.boostEndTime) > Date.now() / 1000,
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/campaigns" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowLeft size={20} />
        Back to Campaigns
      </Link>

      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{petition.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{petition.description}</p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                <TrendingUp size={12} className="mr-1" />
                {petition.momentum}
              </Badge>
              {petition.isBoosted && (
                <Badge className="bg-accent/20 text-accent border-accent/50">
                  <Zap size={12} className="mr-1" />
                  Boosted
                </Badge>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <Card className="glass-dark border-primary/20 p-4 w-full md:w-48">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {petition.creatorImage}
              </div>
              <div className="text-sm flex-1 min-w-0">
                <p className="font-semibold">Started by</p>
                <p className="text-muted-foreground break-words font-mono text-xs">
                  {petition.creator}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <Card className="glass-dark border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Signatures */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <Users size={20} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Signatures</p>
                <p className="text-2xl font-bold">{petition.supporters.toLocaleString()}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <Clock size={20} className="text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-semibold">{petition.createdDate}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <TrendingUp size={20} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-semibold">{petition.isBoosted ? "Boosted" : "Active"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action Buttons - Using PetitionActions Component */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <PetitionActions petitionId={petitionId} />
        </div>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => {
            navigator.share?.({
              title: petition.title,
              text: petition.description,
              url: window.location.href,
            });
          }}
        >
          <Share2 size={20} />
          Share
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* About Section */}
        <Card className="glass-dark border-primary/20">
          <CardHeader>
            <CardTitle>About This Petition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{petition.description}</p>
          </CardContent>
        </Card>

        {/* Signers Section */}
        <PetitionSigners petitionId={petitionId} />
      </div>
    </div>
  )
}
