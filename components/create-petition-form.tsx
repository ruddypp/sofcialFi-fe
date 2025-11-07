"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Upload, Loader2, AlertCircle, CheckCircle, Image as ImageIcon, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useActiveAccount } from "thirdweb/react"
import { useHasMintedSBT, useGetCampaignTokenBalance, useGetPricingInfo, useCreatePetition } from "@/hooks/use-contracts"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CreatePetitionForm() {
  const router = useRouter()
  const account = useActiveAccount()
  const { data: hasMinted, isLoading: checkingSBT } = useHasMintedSBT(account?.address || "")
  const { data: tokenBalance, isLoading: loadingBalance } = useGetCampaignTokenBalance(account?.address || "")
  const { data: pricingInfo, isLoading: loadingPricing } = useGetPricingInfo()
  const { write: createPetition, isPending: isCreating } = useCreatePetition()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageHash, setImageHash] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Convert token balance from wei to readable format
  const tokenBalanceNumber = tokenBalance ? Number(tokenBalance) / 1e18 : 0
  const hasToken = tokenBalanceNumber >= 1
  const baseFee = pricingInfo?.[0] ? Number(pricingInfo[0]) : 0
  const baseFeeETH = baseFee / 1e18 // Convert from wei

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB")
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Upload image to IPFS (placeholder - implement actual IPFS upload)
  const uploadToIPFS = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      // TODO: Implement actual IPFS upload
      // For now, return a placeholder hash
      // You can use services like Pinata, Web3.Storage, or NFT.Storage
      
      // Example using FormData (you'll need to set up an API route or use a service)
      const formData = new FormData()
      formData.append("file", file)

      // Placeholder - replace with actual IPFS upload logic
      // const response = await fetch("/api/upload-ipfs", { method: "POST", body: formData })
      // const { hash } = await response.json()
      
      // For now, return empty string or placeholder
      toast.info("Image upload to IPFS - placeholder. Please implement IPFS upload service.")
      return "" // Return empty for now, user can add IPFS hash manually
    } catch (error) {
      console.error("IPFS upload error:", error)
      toast.error("Failed to upload image to IPFS")
      return ""
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageHash("")
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

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in title and description")
      return
    }

    // Upload image to IPFS if file is selected
    let finalImageHash = imageHash
    if (imageFile && !imageHash) {
      finalImageHash = await uploadToIPFS(imageFile)
      if (!finalImageHash) {
        toast.warning("Image upload skipped. You can add IPFS hash manually or proceed without image.")
      }
    }

    // Use token if available (has at least 1 token), otherwise use ETH
    const useToken = hasToken
    const value = useToken ? undefined : BigInt(baseFee) // Send ETH if not using token

    try {
      createPetition(
        "createPetition",
        [
          title.trim(),
          description.trim(),
          finalImageHash || "ipfs://", // Image hash (IPFS hash or empty)
          useToken
        ],
        value
      )
      
      toast.success(useToken 
        ? "Creating petition with your free token..." 
        : `Creating petition... Paying ${baseFeeETH.toFixed(6)} ETH`
      )
      
      // Redirect after transaction
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      toast.error(error?.message || "Failed to create petition")
    }
  }

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
      <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Create a New Petition</h1>
        <p className="text-muted-foreground">
          Share your idea and mobilize our community. One petition per token, or pay ETH to create more.
        </p>
      </div>

      {/* Payment Info */}
      <Alert className={hasToken ? "bg-primary/10 border-primary/30" : ""}>
        {hasToken ? (
          <>
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Free Petition Available!</strong> You have {tokenBalanceNumber.toFixed(2)} CAMP token(s). 
              This petition will be created for free using your token.
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

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <Card className="glass-dark border-primary/20">
          <CardHeader>
            <CardTitle>Petition Information</CardTitle>
            <CardDescription>
              Fill in the details of your petition. All fields are required except image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold">
                Petition Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="E.g., Ocean Cleanup Initiative"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card/50 border-primary/20"
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your petition in detail. What problem are you trying to solve? What's your proposed solution?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-card/50 border-primary/20 resize-none"
                rows={8}
                maxLength={5000}
                required
              />
              <p className="text-xs text-muted-foreground">{description.length}/5000 characters</p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="font-semibold">
                Featured Image (Optional)
              </Label>
              
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg border border-primary/20"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:border-primary/40 transition-colors bg-muted/30"
                  >
                    <ImageIcon size={48} className="mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              )}

              {/* Manual IPFS Hash Input (Alternative) */}
              {!imageFile && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="imageHash" className="text-sm text-muted-foreground">
                    Or enter IPFS hash directly:
                  </Label>
                  <Input
                    id="imageHash"
                    placeholder="ipfs://Qm..."
                    value={imageHash}
                    onChange={(e) => setImageHash(e.target.value)}
                    className="bg-card/50 border-primary/20 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold mb-3">Petition Summary</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Title:</span>{" "}
                  <span className="font-medium">{title || "Not set"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Payment:</span>{" "}
                  <span className="font-medium">
                    {hasToken ? "Free (Using CAMP Token)" : `${baseFeeETH.toFixed(6)} ETH`}
                  </span>
                </p>
                {imageHash && (
                  <p>
                    <span className="text-muted-foreground">Image:</span>{" "}
                    <span className="font-medium text-xs break-all">{imageHash}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3 pt-6">
          <Button 
            type="submit" 
            disabled={!title.trim() || !description.trim() || isCreating || isUploading} 
            className="flex-1 bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isCreating || isUploading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                {isUploading ? "Uploading Image..." : "Creating Petition..."}
              </>
            ) : (
              hasToken ? "Create Petition (Free)" : `Create Petition (${baseFeeETH.toFixed(6)} ETH)`
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
