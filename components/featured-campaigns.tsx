"use client"

import { useGetActiveBoostedPetitions } from "@/hooks/use-contracts"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { TrendingPetitions } from "@/components/trending-petitions"

export function FeaturedCampaigns() {
  // Using TrendingPetitions which already fetches from contract
  // This component can be simplified or removed since TrendingPetitions handles it
  return null
}
