"use client"

import { TrendingUp, MessageSquare, Share2, Zap, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetAllPetitions, useGetActiveBoostedPetitions } from "@/hooks/use-contracts"
import { useMemo } from "react"
import Link from "next/link"

interface Petition {
  id: bigint | number;
  title: string;
  description: string;
  imageHash: string;
  creator: string;
  createdAt: bigint | number;
  boostEndTime: bigint | number;
  boostPriority: bigint | number;
  signatureCount: bigint | number;
}

export function TrendingPetitions() {
  const { data: allPetitions, isLoading: isLoadingAll } = useGetAllPetitions();
  const { data: boostedPetitions, isLoading: isLoadingBoosted } = useGetActiveBoostedPetitions();

  // Sort petitions: boosted first (by boostPriority), then by createdAt
  const sortedPetitions = useMemo(() => {
    if (!allPetitions) return [];
    
    const petitions = (allPetitions as Petition[]).map((p) => ({
      ...p,
      id: Number(p.id),
      signatureCount: Number(p.signatureCount),
      createdAt: Number(p.createdAt),
      boostEndTime: Number(p.boostEndTime),
      boostPriority: Number(p.boostPriority),
      isBoosted: Number(p.boostEndTime) > Date.now() / 1000,
    }));

    // Sort: boosted first (by priority), then by creation time
    return petitions.sort((a, b) => {
      // If both boosted, sort by priority (higher first)
      if (a.isBoosted && b.isBoosted) {
        return b.boostPriority - a.boostPriority;
      }
      // If only one boosted, it comes first
      if (a.isBoosted) return -1;
      if (b.isBoosted) return 1;
      // Both not boosted, sort by creation time (newer first)
      return b.createdAt - a.createdAt;
    });
  }, [allPetitions]);

  if (isLoadingAll || isLoadingBoosted) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Trending Petitions</h2>
          <p className="text-muted-foreground">Top petitions gaining support this week</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    );
  }

  if (!sortedPetitions || sortedPetitions.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Trending Petitions</h2>
          <p className="text-muted-foreground">Top petitions gaining support this week</p>
        </div>
        <Card className="glass-dark border-primary/20 p-8 text-center">
          <p className="text-muted-foreground">No petitions yet. Be the first to create one!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Trending Petitions</h2>
        <p className="text-muted-foreground">Top petitions gaining support this week</p>
      </div>

      <div className="space-y-3">
        {sortedPetitions.slice(0, 10).map((petition, index) => (
          <Link key={petition.id} href={`/petitions/${petition.id}`}>
            <Card className={`glass-dark transition-all group cursor-pointer relative overflow-hidden ${
              petition.isBoosted 
                ? "border-accent/50 border-2 shadow-lg shadow-accent/20" 
                : "border-primary/20 hover:border-primary/40"
            }`}>
              {/* Boosted Glow Effect */}
              {petition.isBoosted && (
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 pointer-events-none" />
              )}
              
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
                    petition.isBoosted 
                      ? "bg-gradient-to-br from-accent to-primary border-accent shadow-lg shadow-accent/50 animate-pulse" 
                      : "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30"
                  }`}>
                    {petition.isBoosted ? (
                      <Zap size={16} className="text-white fill-white" />
                    ) : (
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className={`font-semibold group-hover:text-primary transition-colors line-clamp-2 ${
                        petition.isBoosted ? "text-accent" : "text-foreground"
                      }`}>
                        {petition.title}
                      </h3>
                      {petition.isBoosted && (
                        <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 text-xs font-bold shadow-md">
                          <Zap size={10} className="mr-1 fill-white" />
                          BOOSTED
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {petition.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {petition.signatureCount.toLocaleString()} signatures
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(Number(petition.createdAt) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.share?.({
                            title: petition.title,
                            text: petition.description,
                            url: `${window.location.origin}/petitions/${petition.id}`,
                          });
                        }}
                      >
                        <Share2 size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
