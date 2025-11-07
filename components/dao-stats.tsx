"use client"

import { useGetTotalPetitions } from "@/hooks/use-contracts"
import { BarChart3, Users, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function DaoStats() {
  const { data: totalPetitions, isLoading } = useGetTotalPetitions()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-dark border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      icon: FileText,
      label: "Total Petitions",
      value: totalPetitions ? Number(totalPetitions).toLocaleString() : "0",
      color: "from-primary to-cyan-400",
    },
    {
      icon: Users,
      label: "DAO Members",
      value: "-",
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: BarChart3,
      label: "Platform Stats",
      value: "Active",
      color: "from-accent to-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="glass-dark border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                </div>
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color}/20`}>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
