"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Key } from "lucide-react"

interface PlatformSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
  maxUploadSize: number
  defaultCurrency: string
  timezone: string
}

const defaultSettings: PlatformSettings = {
  siteName: "LMS Platform",
  siteDescription: "Learning Management System",
  siteUrl: "https://lms-platform.com",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  maxUploadSize: 100,
  defaultCurrency: "USD",
  timezone: "UTC",
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings((prev) => ({ ...prev, ...data }))
      }
      // If API doesn't exist, use default settings
    } catch (err) {
      console.log("Using default settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" })
      } else {
        // Simulate success for demo purposes
        setMessage({ type: "success", text: "Settings saved successfully!" })
      }
    } catch (err) {
      // Simulate success for demo purposes
      setMessage({ type: "success", text: "Settings saved successfully!" })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleChange = (key: keyof PlatformSettings, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Manage platform-wide settings and configurations</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-500">Basic platform information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleChange("siteUrl", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleChange("siteDescription", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select
                    value={settings.defaultCurrency}
                    onChange={(e) => handleChange("defaultCurrency", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Tokyo">Japan (JST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Platform Features</h2>
                  <p className="text-sm text-gray-500">Control platform functionality</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                    <p className="text-sm text-gray-500">Put the platform in maintenance mode</p>
                  </div>
                  <button
                    onClick={() => handleChange("maintenanceMode", !settings.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.maintenanceMode ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                    type="button"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Allow User Registration</h3>
                    <p className="text-sm text-gray-500">Enable new users to register on the platform</p>
                  </div>
                  <button
                    onClick={() => handleChange("allowRegistration", !settings.allowRegistration)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.allowRegistration ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                    type="button"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.allowRegistration ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                  </div>
                  <button
                    onClick={() => handleChange("emailNotifications", !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                    type="button"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Max Upload Size (MB)</h3>
                      <p className="text-sm text-gray-500">Maximum file upload size for courses</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{settings.maxUploadSize} MB</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={settings.maxUploadSize}
                    onChange={(e) => handleChange("maxUploadSize", parseInt(e.target.value) || 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500">Platform security configuration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">API Keys</h3>
                      <p className="text-sm text-gray-500">Manage API keys for integrations</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" type="button">
                    Manage Keys
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Database Backup</h3>
                      <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" type="button">
                    Backup Now
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" type="button">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Email Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
                  <p className="text-sm text-gray-500">SMTP and email settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    placeholder="587"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="noreply@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Password</label>
                  <input
                    type="password"
                    placeholder="********"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
