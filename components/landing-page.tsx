"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Shield, Coins, FileText, Zap, Users, CheckCircle, Sparkles, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { thirdwebClient } from "@/app/config"
import { inAppWallet } from "thirdweb/wallets"
import { defineChain } from "thirdweb/chains"
import DarkVeil from "@/components/DarkVeil"
import { SponsorMarquee } from "@/components/sponsor-marquee"

// Define Lisk Sepolia chain
const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Lisk Sepolia ETH",
    symbol: "LSK",
    decimals: 18,
  },
  rpc: "https://rpc.sepolia-api.lisk.com",
});

const wallet = inAppWallet({
  executionMode: {
    mode: "EIP7702",
    sponsorGas: true
  }, 
  chain: liskSepolia
});

const features = [
  {
    icon: Shield,
    title: "Soulbound Token Identity",
    description: "One wallet, one voice. Get your unique, non-transferable SBT to verify your identity and prevent fake accounts.",
    color: "from-primary to-cyan-400",
  },
  {
    icon: Coins,
    title: "Free First Petition",
    description: "After registration, receive 1 CampaignToken to create your first petition completely free. No gas fees!",
    color: "from-teal-500 to-blue-500",
  },
  {
    icon: FileText,
    title: "Decentralized Petitions",
    description: "Create and sign petitions on-chain. Every signature is recorded immutably on the blockchain.",
    color: "from-blue-500 to-primary",
  },
  {
    icon: Zap,
    title: "Boost Your Campaign",
    description: "Increase visibility by boosting your petition for 7 days. First-come, first-served priority system.",
    color: "from-accent to-primary",
  },
]

const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description: "Connect your Web3 wallet to get started. We support gasless transactions on Lisk Sepolia.",
  },
  {
    number: "02",
    title: "Mint SBT",
    description: "Register as a member by minting your Soulbound Token. It's free and takes just one click.",
  },
  {
    number: "03",
    title: "Get Free Token",
    description: "Receive 1 CampaignToken automatically after registration to create your first petition for free.",
  },
  {
    number: "04",
    title: "Create & Sign",
    description: "Start your petition or support others by signing. Every action is transparent and on-chain.",
  },
]

// Hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

export function LandingPage() {
  const account = useActiveAccount()
  const heroRef = useScrollAnimation()
  const featuresRef = useScrollAnimation()
  const stepsRef = useScrollAnimation()
  const securityRef = useScrollAnimation()
  const ctaRef = useScrollAnimation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden relative">
      {/* DarkVeil Background - Fixed position covering entire page */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }}
      >
        <DarkVeil 
          hueShift={47}
          noiseIntensity={0.05}
          scanlineIntensity={0}
          speed={0.3}
          scanlineFrequency={0.5}
          warpAmount={0.3}
          resolutionScale={1}
        />
      </div>

      {/* Overlay to ensure content is readable - reduced opacity */}
      <div className="fixed inset-0 z-[1] bg-background/20 backdrop-blur-[1px]" />

      {/* Content wrapper with higher z-index */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ImpactChain
              </span>
            </div>
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
              <Link href="/campaigns">
                <Button variant="ghost" className="hidden md:flex hover:scale-105 transition-all duration-300">
                  Explore Campaigns
                </Button>
              </Link>
              <div className="[&_button]:h-9 [&_button]:rounded-lg [&_button]:bg-gradient-to-r [&_button]:from-primary [&_button]:to-accent [&_button]:text-primary-foreground [&_button]:border-0 [&_button]:px-4 [&_button]:font-medium [&_button]:hover:opacity-90 [&_button]:hover:scale-105 [&_button]:transition-all [&_button]:duration-300 [&_button]:hover:shadow-lg [&_button]:hover:shadow-primary/50">
                <ConnectButton 
                  client={thirdwebClient}
                  chain={liskSepolia}
                  connectButton={{
                    label: account ? "Go to Dashboard" : "Connect Wallet",
                  }}
                  connectModal={{
                    size: "wide",
                  }}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6" ref={heroRef.ref}>
          <div className="container mx-auto max-w-6xl">
            <div className={`text-center space-y-6 mb-12 transition-all duration-1000 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="bg-primary/20 text-primary border-primary/50 px-4 py-1 animate-in fade-in zoom-in duration-700 delay-300">
                <Globe className="mr-2 animate-spin-slow" size={14} />
                Decentralized • Transparent • Gasless
              </Badge>
              <h1 className={`text-5xl md:text-7xl font-bold leading-tight transition-all duration-1000 delay-200 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Empower Your Voice
                </span>
                <br />
                <span className="text-foreground">Through Web3 Petitions</span>
              </h1>
              <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-400 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Create and sign digital petitions on the blockchain. One wallet, one voice. 
                Transparent, immutable, and completely gasless on Lisk Sepolia.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 transition-all duration-1000 delay-600 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {account ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
                      Go to Dashboard
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </Link>
                ) : (
                  <div className="[&_button]:h-12 [&_button]:rounded-lg [&_button]:bg-gradient-to-r [&_button]:from-primary [&_button]:to-accent [&_button]:text-primary-foreground [&_button]:border-0 [&_button]:px-8 [&_button]:font-medium [&_button]:hover:opacity-90 [&_button]:text-lg [&_button]:hover:scale-105 [&_button]:transition-all [&_button]:duration-300 [&_button]:hover:shadow-lg [&_button]:hover:shadow-primary/50">
                    <ConnectButton 
                      client={thirdwebClient}
                      chain={liskSepolia}
                      connectButton={{
                        label: "Get Started",
                      }}
                      connectModal={{
                        size: "wide",
                      }}
                    />
                  </div>
                )}
                <Link href="/campaigns">
                  <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 px-8 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    Explore Petitions
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 transition-all duration-1000 delay-800 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="glass-dark border-primary/20 text-center hover:scale-105 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group bg-background/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                  <div className="text-sm text-muted-foreground">Gasless Transactions</div>
                </CardContent>
              </Card>
              <Card className="glass-dark border-primary/20 text-center hover:scale-105 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group delay-100 bg-background/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">1:1</div>
                  <div className="text-sm text-muted-foreground">One Wallet, One Voice</div>
                </CardContent>
              </Card>
              <Card className="glass-dark border-primary/20 text-center hover:scale-105 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group delay-200 bg-background/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">Free</div>
                  <div className="text-sm text-muted-foreground">First Petition</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sponsor Marquee Section */}
        <SponsorMarquee />

        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/20 backdrop-blur-sm" ref={featuresRef.ref}>
          <div className="container mx-auto max-w-6xl">
            <div className={`text-center mb-12 transition-all duration-1000 ${featuresRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl font-bold mb-4">Why ImpactChain?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built on blockchain technology to ensure transparency, authenticity, and democratic participation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={index} 
                    className={`glass-dark border-primary/20 hover:border-primary/40 transition-all group hover:scale-105 hover:shadow-xl hover:shadow-primary/10 bg-background/80 backdrop-blur-sm ${
                      featuresRef.isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6" ref={stepsRef.ref}>
          <div className="container mx-auto max-w-6xl">
            <div className={`text-center mb-12 transition-all duration-1000 ${stepsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Get started in just 4 simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card 
                  key={index} 
                  className={`glass-dark border-primary/20 relative overflow-hidden hover:scale-105 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group bg-background/80 backdrop-blur-sm ${
                    stepsRef.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full group-hover:from-primary/40 transition-all duration-300" />
                  <CardHeader>
                    <div className="text-6xl font-bold text-primary/20 mb-4 group-hover:text-primary/30 group-hover:scale-110 transition-all duration-300">{step.number}</div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Trust */}
        <section className="py-20 px-6 bg-muted/20 backdrop-blur-sm" ref={securityRef.ref}>
          <div className="container mx-auto max-w-6xl">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${securityRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <Badge className="bg-primary/20 text-primary border-primary/50 mb-4 animate-pulse">
                  <Lock className="mr-2" size={14} />
                  Secure & Transparent
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Built on Blockchain</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Every petition and signature is recorded on-chain, ensuring complete transparency and immutability. 
                  Your voice cannot be silenced or manipulated.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="text-primary mt-1 group-hover:scale-125 transition-transform duration-300" size={20} />
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">Soulbound Token Identity</p>
                      <p className="text-sm text-muted-foreground">Prevents fake accounts and ensures one person, one vote</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="text-primary mt-1 group-hover:scale-125 transition-transform duration-300" size={20} />
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">Gasless Transactions</p>
                      <p className="text-sm text-muted-foreground">Powered by Lisk Sepolia - no gas fees for users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="text-primary mt-1 group-hover:scale-125 transition-transform duration-300" size={20} />
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">Immutable Records</p>
                      <p className="text-sm text-muted-foreground">All signatures are permanently stored on the blockchain</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="glass-dark border-primary/20 p-8 hover:scale-105 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-background/80 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Shield className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">Verified Identity</p>
                      <p className="text-sm text-muted-foreground">SBT ensures authentic participation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Coins className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-accent transition-colors">Free First Petition</p>
                      <p className="text-sm text-muted-foreground">Get 1 CampaignToken after registration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Users className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">Community Driven</p>
                      <p className="text-sm text-muted-foreground">Join thousands making an impact</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6" ref={ctaRef.ref}>
          <div className="container mx-auto max-w-4xl">
            <Card className={`glass-dark border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 text-center p-12 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 backdrop-blur-sm ${ctaRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader>
                <CardTitle className="text-4xl font-bold mb-4 animate-pulse-slow">Ready to Make an Impact?</CardTitle>
                <CardDescription className="text-lg">
                  Join the decentralized movement for transparent, democratic participation. 
                  Start your journey today - it's free and gasless!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {account ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
                        Go to Dashboard
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                      </Button>
                    </Link>
                  ) : (
                    <div className="[&_button]:h-12 [&_button]:rounded-lg [&_button]:bg-gradient-to-r [&_button]:from-primary [&_button]:to-accent [&_button]:text-primary-foreground [&_button]:border-0 [&_button]:px-8 [&_button]:font-medium [&_button]:hover:opacity-90 [&_button]:text-lg [&_button]:hover:scale-110 [&_button]:transition-all [&_button]:duration-300 [&_button]:hover:shadow-lg [&_button]:hover:shadow-primary/50">
                      <ConnectButton 
                        client={thirdwebClient}
                        chain={liskSepolia}
                        connectButton={{
                          label: "Get Started Now",
                        }}
                        connectModal={{
                          size: "wide",
                        }}
                      />
                    </div>
                  )}
                  <Link href="/campaigns">
                    <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 px-8 hover:scale-110 transition-all duration-300 hover:shadow-lg">
                      Browse Petitions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                  <Sparkles className="text-white" size={16} />
                </div>
                <span className="text-sm font-semibold">ImpactChain</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/campaigns" className="hover:text-primary hover:scale-110 transition-all duration-300">Campaigns</Link>
                <Link href="/dashboard" className="hover:text-primary hover:scale-110 transition-all duration-300">Dashboard</Link>
                <span className="hover:text-primary transition-colors">Built on Lisk Sepolia</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}