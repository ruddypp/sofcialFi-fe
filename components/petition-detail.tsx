"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Vote,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PetitionActions } from "@/components/petition-actions"
import { useGetPetition } from "@/hooks/use-contracts"
import { Loader2 } from "lucide-react"

interface PetitionDetailProps {
  petitionId: number
}

export function PetitionDetail({ petitionId }: PetitionDetailProps) {
  const { data: petitionData, isLoading } = useGetPetition(petitionId)
  const [isLiked, setIsLiked] = useState(false)

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
    fullDescription: petitionData.description || "",
    category: "General",
    status: "active",
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
              <Badge className="bg-primary/20 text-primary">{petition.category}</Badge>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                <TrendingUp size={12} className="mr-1" />
                {petition.momentum}
              </Badge>
            </div>
          </div>

          {/* Creator Info */}
          <Card className="glass-dark border-primary/20 p-4 w-full md:w-48">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {petition.creatorImage}
              </div>
              <div className="text-sm">
                <p className="font-semibold">Started by</p>
                <p className="text-muted-foreground">{petition.creator}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-xs bg-transparent">
              Follow
            </Button>
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
          onClick={() => setIsLiked(!isLiked)}
          className={isLiked ? "text-accent border-accent/50" : ""}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          {isLiked ? "Liked" : "Like"}
        </Button>
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="updates">Updates & Discussion</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>About This Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{petition.fullDescription}</p>

            </CardContent>
          </Card>

        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-6">
          <Card className="glass-dark border-primary/20 p-8 text-center">
            <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={32} />
            <h3 className="text-lg font-semibold mb-2">Updates & Discussion</h3>
            <p className="text-muted-foreground">This feature will be available soon</p>
          </Card>
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="space-y-6">
          <Card className="glass-dark border-primary/20 p-8 text-center">
            <Vote className="mx-auto mb-4 text-muted-foreground" size={32} />
            <h3 className="text-lg font-semibold mb-2">Governance</h3>
            <p className="text-muted-foreground">Governance features coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
