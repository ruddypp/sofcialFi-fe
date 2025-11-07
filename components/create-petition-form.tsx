"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActiveAccount } from "thirdweb/react"
import { useHasMintedSBT, useGetCampaignTokenBalance, useGetPricingInfo, useCreatePetition } from "@/hooks/use-contracts"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

const categories = ["Environment", "Education", "Health", "Social", "Tech", "Climate", "Conservation"]

export function CreatePetitionForm() {
  const router = useRouter()
  const account = useActiveAccount()
  const { data: hasMinted, isLoading: checkingSBT } = useHasMintedSBT(account?.address || "")
  const { data: tokenBalance, isLoading: loadingBalance } = useGetCampaignTokenBalance(account?.address || "")
  const { data: pricingInfo, isLoading: loadingPricing } = useGetPricingInfo()
  const { write: createPetition, isPending: isCreating } = useCreatePetition()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [category, setCategory] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [timeline, setTimeline] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [step, setStep] = useState(1)
  const [imageHash, setImageHash] = useState("")

  const hasToken = tokenBalance && Number(tokenBalance) > 0
  const baseFee = pricingInfo?.[0] ? Number(pricingInfo[0]) : 0
  const baseFeeETH = baseFee / 1e18 // Convert from wei

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!hasMinted) {
      toast.error("You must register as a member first. Please mint your SBT.")
      router.push("/")
      return
    }

    if (!title || !description) {
      toast.error("Please fill in all required fields")
      return
    }

    // Use token if available, otherwise use ETH
    const useToken = hasToken || false
    const value = useToken ? undefined : BigInt(baseFee) // Send ETH if not using token

    try {
      createPetition(
        "createPetition",
        [
          title,
          description, // Using description as main content
          imageHash || "ipfs://", // Image hash (can be empty for now)
          useToken
        ],
        value
      )
      
      toast.success(useToken 
        ? "Creating petition with your free token..." 
        : `Creating petition... Paying ${baseFeeETH.toFixed(6)} ETH`
      )
      
      // Redirect after a delay (transaction will be processed)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: any) {
      toast.error(error?.message || "Failed to create petition")
    }
  }

  const isStep1Valid = title && description
  const isStep2Valid = fullDescription
  const isStep3Valid = true // Removed tags requirement

  // Show loading or error states
  if (checkingSBT || loadingBalance || loadingPricing) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please connect your wallet to create a petition</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!hasMinted) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must register as a member first. <Link href="/" className="text-primary underline">Go to homepage to mint your SBT</Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back Button */}
      <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Create a New Petition</h1>
        <p className="text-muted-foreground">Share your idea and mobilize our community to make a difference</p>
      </div>

      {/* Payment Info */}
      <Alert className={hasToken ? "bg-primary/10 border-primary/30" : ""}>
        {hasToken ? (
          <>
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Free Petition!</strong> You have {Number(tokenBalance)} CampaignToken(s). This petition will be created for free using your token.
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Payment Required:</strong> You'll need to pay {baseFeeETH.toFixed(6)} ETH to create this petition. 
              Your first petition was free with your SBT registration token.
            </AlertDescription>
          </>
        )}
      </Alert>

      {/* Progress Steps */}
      <div className="flex gap-2 justify-between">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1">
            <div className={`h-2 rounded-full transition-all ${step >= num ? "bg-primary" : "bg-muted"}`} />
            <p className="text-xs mt-2 text-center text-muted-foreground">
              {num === 1 ? "Basics" : num === 2 ? "Details" : "Finalize"}
            </p>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about your petition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">
                  Petition Title
                </Label>
                <Input
                  id="title"
                  placeholder="E.g., Ocean Cleanup Initiative"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-card/50 border-primary/20"
                />
                <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">
                  Short Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="A one-line summary of your petition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-card/50 border-primary/20 resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">{description.length}/200 characters</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-card/50 border-primary/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Provide more information about your petition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Description */}
              <div className="space-y-2">
                <Label htmlFor="fullDescription" className="font-semibold">
                  Detailed Description
                </Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Explain your petition in detail. What problem are you trying to solve? What's your proposed solution?"
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="bg-card/50 border-primary/20 resize-none"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">{fullDescription.length}/2000 characters</p>
              </div>

              {/* Funding Goal */}
              <div className="space-y-2">
                <Label htmlFor="fundingGoal" className="font-semibold">
                  Funding Goal (USD)
                </Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  placeholder="50000"
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  className="bg-card/50 border-primary/20"
                />
                <p className="text-xs text-muted-foreground">Set a realistic target for your campaign</p>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <Label htmlFor="timeline" className="font-semibold">
                  Campaign Duration
                </Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger className="bg-card/50 border-primary/20">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="12-months">12 Months</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Tags & Media */}
        {step === 3 && (
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Tags & Media</CardTitle>
              <CardDescription>Help people discover your petition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags */}
              <div className="space-y-2">
                <Label className="font-semibold">Tags</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-card/50 border-primary/20"
                    />
                    <Button type="button" onClick={addTag} size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus size={16} />
                    </Button>
                  </div>

                  {/* Tags List */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-primary/20 text-primary border-primary/50 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X size={14} className="ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Add relevant tags to help others find your petition</p>
              </div>

              {/* Featured Image Upload */}
              <div className="space-y-2">
                <Label className="font-semibold">Featured Image (Optional)</Label>
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Drop image here or click to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Review Summary */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <h4 className="font-semibold mb-3">Your Petition Summary</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Title:</span> <span className="font-medium">{title}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    <span className="font-medium">{category}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Funding Goal:</span>{" "}
                    <span className="font-medium">${fundingGoal}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    <span className="font-medium">{timeline}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex-1 bg-transparent"
          >
            Back
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={!isStep3Valid || isCreating} 
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Creating...
                </>
              ) : (
                hasToken ? "Create Petition (Free)" : `Create Petition (${baseFeeETH.toFixed(6)} ETH)`
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
