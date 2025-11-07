"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"
import { useGetAllPetitions, useHasUserSigned } from "@/hooks/use-contracts"
import { useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MyActionsHub() {
  const account = useActiveAccount()
  const { data: allPetitions, isLoading } = useGetAllPetitions()

  // Filter petitions created or signed by user
  const myPetitions = useMemo(() => {
    if (!allPetitions || !account) return []
    
    return (allPetitions as any[]).filter((p) => {
      const creator = p.creator?.toLowerCase()
      const userAddress = account.address?.toLowerCase()
      return creator === userAddress
    }).map((p) => ({
      id: Number(p.id),
      title: p.title || "Untitled",
      signatureCount: Number(p.signatureCount || 0),
      createdAt: Number(p.createdAt),
    }))
  }, [allPetitions, account])

  if (!account) {
    return (
      <Card className="glass-dark border-primary/20 p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">My Actions</h3>
        <p className="text-muted-foreground">Please connect your wallet to view your actions</p>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Petitions</h2>
        <p className="text-muted-foreground">Petitions you've created</p>
      </div>

      {myPetitions.length === 0 ? (
        <Card className="glass-dark border-primary/20 p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No petitions created yet</h3>
          <p className="text-muted-foreground mb-4">Create your first petition to get started</p>
          <Link href="/create">
            <Button className="bg-primary hover:bg-primary/90">Create Petition</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myPetitions.map((petition) => (
            <Link key={petition.id} href={`/petitions/${petition.id}`}>
              <Card className="glass-dark border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{petition.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {petition.signatureCount} signatures • Created {new Date(petition.createdAt * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
