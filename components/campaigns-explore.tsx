"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, TrendingUp, Users, Calendar, ChevronRight, Loader2, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllPetitions } from "@/hooks/use-contracts"

export function CampaignsExplore() {
  const { data: allPetitions, isLoading } = useGetAllPetitions()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("trending")

  const filteredAndSortedCampaigns = useMemo(() => {
    if (!allPetitions) return []
    
    const petitions = (allPetitions as any[]).map((p) => ({
      id: Number(p.id),
      title: p.title || "Untitled",
      description: p.description || "",
      supporters: Number(p.signatureCount || 0),
      createdAt: Number(p.createdAt),
      isBoosted: Number(p.boostEndTime) > Date.now() / 1000,
      boostPriority: Number(p.boostPriority || 0),
      createdDate: new Date(Number(p.createdAt) * 1000).toLocaleDateString(),
    }))

    let filtered = petitions.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "trending") {
        // Boosted first, then by supporters
        if (a.isBoosted && !b.isBoosted) return -1
        if (!a.isBoosted && b.isBoosted) return 1
        if (a.isBoosted && b.isBoosted) {
          return b.boostPriority - a.boostPriority
        }
        return b.supporters - a.supporters
      }
      if (sortBy === "newest") return b.createdAt - a.createdAt
      return 0
    })

    return filtered
  }, [allPetitions, searchTerm, sortBy])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Explore Campaigns</h1>
        <p className="text-muted-foreground">Discover and support impactful petitions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card/50 border-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-card/50 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Most Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAndSortedCampaigns.length} petition{filteredAndSortedCampaigns.length !== 1 ? 's' : ''}
      </p>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCampaigns.map((campaign) => (
          <Link key={campaign.id} href={`/petitions/${campaign.id}`}>
            <Card className={`glass-dark transition-all group h-full cursor-pointer overflow-hidden relative ${
              campaign.isBoosted 
                ? "border-accent/50 border-2 shadow-lg shadow-accent/20" 
                : "border-primary/20 hover:border-primary/40"
            }`}>
              {/* Boosted Glow Effect */}
              {campaign.isBoosted && (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 pointer-events-none" />
              )}
              
              {/* Boosted Badge - Top Right Corner */}
              {campaign.isBoosted && (
                <div className="absolute top-3 right-3 z-20">
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 text-xs font-bold shadow-lg animate-pulse">
                    <Zap size={10} className="mr-1 fill-white" />
                    BOOSTED
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className={`text-lg line-clamp-2 transition-colors flex-1 ${
                    campaign.isBoosted 
                      ? "text-accent group-hover:text-accent/80" 
                      : "group-hover:text-primary"
                  }`}>
                    {campaign.title}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                {/* Date */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} />
                    {campaign.createdDate}
                  </span>
                  {campaign.isBoosted && (
                    <span className="text-xs text-accent font-semibold flex items-center gap-1">
                      <Zap size={10} />
                      Top Priority
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className={`p-3 rounded-lg border ${
                  campaign.isBoosted 
                    ? "bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30" 
                    : "bg-muted/30 border-border/50"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className={campaign.isBoosted ? "text-accent" : "text-primary"} />
                    <span className="text-xs text-muted-foreground">Signatures</span>
                  </div>
                  <p className={`text-sm font-semibold ${campaign.isBoosted ? "text-accent" : ""}`}>
                    {campaign.supporters.toLocaleString()}
                  </p>
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                  View Petition
                  <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedCampaigns.length === 0 && (
        <Card className="glass-dark border-primary/20 p-8 text-center">
          <Filter className="mx-auto mb-4 text-muted-foreground" size={32} />
          <h3 className="text-lg font-semibold mb-2">No petitions found</h3>
          <p className="text-muted-foreground">Try adjusting your search term or be the first to create one!</p>
        </Card>
      )}
    </div>
  )
}
