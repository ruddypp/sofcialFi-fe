"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function GovernanceHub() {
  // Governance features can be added later
  // For now, show empty state
  return (
    <Card className="glass-dark border-primary/20 p-12 text-center">
      <Loader2 className="mx-auto mb-4 text-muted-foreground animate-spin" size={32} />
      <h3 className="text-lg font-semibold mb-2">Governance Hub</h3>
      <p className="text-muted-foreground">Governance features coming soon...</p>
    </Card>
  )
}
