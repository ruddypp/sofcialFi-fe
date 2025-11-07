"use client"

import Link from "next/link"
import { Plus, Search, Vote, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: "Create Petition",
      href: "/create",
      color: "from-primary to-cyan-400",
    },
    {
      icon: Search,
      label: "Explore Campaigns",
      href: "/campaigns",
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: Vote,
      label: "View Governance",
      href: "/governance",
      color: "from-blue-500 to-primary",
    },
    {
      icon: Settings,
      label: "Manage Profile",
      href: "/settings",
      color: "from-accent to-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.href} href={action.href}>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-transparent border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all group"
            >
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${action.color}/20 group-hover:${action.color}/30 transition-colors`}
              >
                <Icon size={20} className="text-primary group-hover:text-accent transition-colors" />
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}
