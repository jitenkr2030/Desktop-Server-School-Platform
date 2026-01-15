"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit,
  Camera,
  SaveIcon,
  Settings,
  BookOpen,
  Award
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  name: string
  email: string
  mobileNumber: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  role: string
  createdAt: string
}

interface ProfileSettings {
  id: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  courseUpdates: boolean
  communityUpdates: boolean
  profileVisibility: string
  showProgress: boolean
  showCertificates: boolean
  showInLeaderboard: boolean
  preferredLanguage: string
  learningMode: string
  reminderFrequency: string
  fontSize: string
  highContrast: boolean
  reducedMotion: boolean
}

interface UserStats {
  totalCourses: number
  completedCourses: number
  totalTimeSpent: number
  certificatesEarned: number
  currentStreak: number
  averageProgress: number
}

export default function ProfilePage() {
  const sessionResult = useSession()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [settings, setSettings] = useState<ProfileSettings | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const session = mounted ? sessionResult.data : null
  const isAuthenticated = mounted && sessionResult.status === 'authenticated'
  const user = session?.user

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfileData()
    }
  }, [isAuthenticated, user])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      // Fetch profile
      const profileResponse = await fetch('/api/profile')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData.profile)
        setFormData({
          name: profileData.profile.name || '',
          email: profileData.profile.email || '',
          bio: profileData.profile.bio || '',
          location: profileData.profile.location || '',
          website: profileData.profile.website || ''
        })
      }

      // Fetch settings
      const settingsResponse = await fetch('/api/profile/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setSettings(settingsData.settings)
      }

      // Fetch user stats
      const statsResponse = await fetch('/api/user/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error('Fetch profile data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setEditingProfile(false)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update profile')
      }
    } catch (error) {
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Settings saved successfully')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update settings')
      }
    } catch (error) {
      alert('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your profile</h2>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => setEditingProfile(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name || 'User'}</h1>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500">Member since {formatDate(profile.createdAt)}</p>
                <Badge className="mt-2" variant="secondary">
                  {profile.role}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Learning
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your personal information and bio</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProfile(!editingProfile)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {editingProfile ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {editingProfile ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Your location"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="Your website or social media"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <SaveIcon className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button variant="outline" onClick={() => setEditingProfile(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{profile.name || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{profile.email || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Mobile</p>
                            <p className="font-medium">{profile.mobileNumber}</p>
                          </div>
                        </div>
                        {profile.bio && (
                          <div className="flex items-start gap-3">
                            <Edit className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">Bio</p>
                              <p className="font-medium">{profile.bio}</p>
                            </div>
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-medium">{profile.location}</p>
                            </div>
                          </div>
                        )}
                        {profile.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Website</p>
                              <a 
                                href={profile.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-orange-600 hover:text-orange-700"
                              >
                                {profile.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {settings && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, emailNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-notifications">SMS Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, smsNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, pushNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="course-updates">Course Updates</Label>
                            <p className="text-sm text-gray-600">Get notified about course updates</p>
                          </div>
                          <Switch
                            id="course-updates"
                            checked={settings.courseUpdates}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, courseUpdates: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="community-updates">Community Updates</Label>
                            <p className="text-sm text-gray-600">Get notified about community activities</p>
                          </div>
                          <Switch
                            id="community-updates"
                            checked={settings.communityUpdates}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, communityUpdates: checked })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy and visibility</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {settings && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="profile-visibility">Profile Visibility</Label>
                          <Select
                            value={settings.profileVisibility}
                            onValueChange={(value) => 
                              setSettings({ ...settings, profileVisibility: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLIC">Public</SelectItem>
                              <SelectItem value="PRIVATE">Private</SelectItem>
                              <SelectItem value="FRIENDS_ONLY">Friends Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="show-progress">Show Progress</Label>
                            <p className="text-sm text-gray-600">Allow others to see your learning progress</p>
                          </div>
                          <Switch
                            id="show-progress"
                            checked={settings.showProgress}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, showProgress: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="show-certificates">Show Certificates</Label>
                            <p className="text-sm text-gray-600">Display your earned certificates publicly</p>
                          </div>
                          <Switch
                            id="show-certificates"
                            checked={settings.showCertificates}
                            onCheckedChange={(checked) => 
                              setSettings({ ...settings, showCertificates: checked })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                    <CardDescription>Customize your learning experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {settings && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="learning-mode">Learning Mode</Label>
                          <Select
                            value={settings.learningMode}
                            onValueChange={(value) => 
                              setSettings({ ...settings, learningMode: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BALANCED">Balanced</SelectItem>
                              <SelectItem value="INTENSIVE">Intensive</SelectItem>
                              <SelectItem value="LEISURE">Leisure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                          <Select
                            value={settings.reminderFrequency}
                            onValueChange={(value) => 
                              setSettings({ ...settings, reminderFrequency: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEVER">Never</SelectItem>
                              <SelectItem value="DAILY">Daily</SelectItem>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Statistics</CardTitle>
                    <CardDescription>Your learning journey at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Courses</span>
                            <span className="font-medium">{stats.totalCourses}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Completed Courses</span>
                            <span className="font-medium text-green-600">{stats.completedCourses}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Certificates Earned</span>
                            <span className="font-medium text-blue-600">{stats.certificatesEarned}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Time Spent Learning</span>
                            <span className="font-medium">{formatDuration(stats.totalTimeSpent)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Current Streak</span>
                            <span className="font-medium text-orange-600">{stats.currentStreak} days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Average Progress</span>
                            <span className="font-medium">{stats.averageProgress.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/certificates" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    My Certificates
                  </Button>
                </Link>
                <Link href="/community" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Community
                  </Button>
                </Link>
                <Link href="/subscription" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Subscription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Photo</span>
                    {profile.avatar ? (
                      <Badge variant="default">Complete</Badge>
                    ) : (
                      <Badge variant="secondary">Missing</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bio</span>
                    {profile.bio ? (
                      <Badge variant="default">Complete</Badge>
                    ) : (
                      <Badge variant="secondary">Missing</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location</span>
                    {profile.location ? (
                      <Badge variant="default">Complete</Badge>
                    ) : (
                      <Badge variant="secondary">Missing</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}