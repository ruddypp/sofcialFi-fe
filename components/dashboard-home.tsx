"use client"
import { QuickActions } from "@/components/quick-actions"
import { DaoStats } from "@/components/dao-stats"
import { TrendingPetitions } from "@/components/trending-petitions"
import { SBTRegistration } from "@/components/sbt-registration"
import { useActiveAccount } from "thirdweb/react"
import { useHasMintedSBT } from "@/hooks/use-contracts"

export function DashboardHome() {
  const account = useActiveAccount()
  const { data: hasMinted } = useHasMintedSBT(account?.address || "")

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to ImpactChain</h1>
        <p className="text-muted-foreground text-lg">
          Empowering global civic impact through decentralized petitions and transparent governance
        </p>
      </div>

      {/* SBT Registration - Show if not registered */}
      {account && !hasMinted && (
        <SBTRegistration />
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* DAO Statistics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Overview</h2>
        <DaoStats />
      </div>

      {/* Trending Petitions Section */}
      <TrendingPetitions />

    </div>
  )
}
