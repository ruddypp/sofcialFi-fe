"use client"

import { useState } from "react"
import { ArrowLeft, Bell, Lock, User, Globe, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsPage() {
  const [email, setEmail] = useState("user@example.com")
  const [displayName, setDisplayName] = useState("Community Member")
  const [bio, setBio] = useState("Passionate about making a difference")
  const [language, setLanguage] = useState("en")
  const [theme, setTheme] = useState("dark")
  const [showPassword, setShowPassword] = useState(false)

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    campaignUpdates: true,
    governanceVotes: true,
    communityComments: false,
    newsletters: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showSupportedCampaigns: true,
    allowMessages: true,
    showImpactScore: true,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] })
  }

  const handleSaveProfile = () => {
    console.log("Profile saved")
  }

  const handleChangePassword = () => {
    console.log("Password change initiated")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and platform settings</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock size={16} />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe size={16} />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                    CM
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG or JPG, max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="font-semibold">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-card/50 border-primary/20"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card/50 border-primary/20"
                />
                <p className="text-xs text-muted-foreground">We'll never share your email with anyone else</p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="font-semibold">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="w-full p-3 rounded-lg bg-card/50 border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
              </div>

              {/* Save Button */}
              <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="font-semibold">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-card/50 border-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-semibold">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-card/50 border-primary/20"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-card/50 border-primary/20"
                />
              </div>

              {/* Password Requirements */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm font-semibold mb-2">Password Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ At least 8 characters long</li>
                  <li>✓ Contains uppercase and lowercase letters</li>
                  <li>✓ Contains at least one number</li>
                  <li>✓ Contains at least one special character</li>
                </ul>
              </div>

              {/* Change Password Button */}
              <Button onClick={handleChangePassword} variant="outline" className="w-full bg-transparent">
                <Lock size={16} className="mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what emails you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campaign Updates */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Campaign Updates</h4>
                  <p className="text-sm text-muted-foreground">Get notified about campaigns you support</p>
                </div>
                <Switch
                  checked={notifications.campaignUpdates}
                  onCheckedChange={() => handleNotificationChange("campaignUpdates")}
                />
              </div>

              {/* Governance Votes */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Governance Votes</h4>
                  <p className="text-sm text-muted-foreground">Be notified when new votes are available</p>
                </div>
                <Switch
                  checked={notifications.governanceVotes}
                  onCheckedChange={() => handleNotificationChange("governanceVotes")}
                />
              </div>

              {/* Community Comments */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Community Comments</h4>
                  <p className="text-sm text-muted-foreground">Get notified on replies to your comments</p>
                </div>
                <Switch
                  checked={notifications.communityComments}
                  onCheckedChange={() => handleNotificationChange("communityComments")}
                />
              </div>

              {/* Newsletter */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Weekly Newsletter</h4>
                  <p className="text-sm text-muted-foreground">Curated updates delivered to your inbox</p>
                </div>
                <Switch
                  checked={notifications.newsletters}
                  onCheckedChange={() => handleNotificationChange("newsletters")}
                />
              </div>

              {/* General Email Updates */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">General Updates</h4>
                  <p className="text-sm text-muted-foreground">Important platform announcements</p>
                </div>
                <Switch
                  checked={notifications.emailUpdates}
                  onCheckedChange={() => handleNotificationChange("emailUpdates")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Public Profile */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Public Profile</h4>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                </div>
                <Switch checked={privacy.profilePublic} onCheckedChange={() => handlePrivacyChange("profilePublic")} />
              </div>

              {/* Show Supported Campaigns */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Show Supported Campaigns</h4>
                  <p className="text-sm text-muted-foreground">Display campaigns you support publicly</p>
                </div>
                <Switch
                  checked={privacy.showSupportedCampaigns}
                  onCheckedChange={() => handlePrivacyChange("showSupportedCampaigns")}
                />
              </div>

              {/* Allow Messages */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Allow Messages</h4>
                  <p className="text-sm text-muted-foreground">Let others send you direct messages</p>
                </div>
                <Switch checked={privacy.allowMessages} onCheckedChange={() => handlePrivacyChange("allowMessages")} />
              </div>

              {/* Show Impact Score */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">Show Impact Score</h4>
                  <p className="text-sm text-muted-foreground">Display your impact score publicly</p>
                </div>
                <Switch
                  checked={privacy.showImpactScore}
                  onCheckedChange={() => handlePrivacyChange("showImpactScore")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Language & Display</CardTitle>
              <CardDescription>Customize your platform experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language" className="font-semibold">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-card/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label htmlFor="theme" className="font-semibold">
                  Theme
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="bg-card/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="glass-dark border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Download Data */}
              <Button variant="outline" className="w-full bg-transparent">
                Download My Data
              </Button>

              {/* Delete Account */}
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
