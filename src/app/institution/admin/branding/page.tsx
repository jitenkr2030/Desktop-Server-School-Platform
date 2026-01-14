'use client'

import { useState } from 'react'

export default function InstitutionBrandingPage() {
  const [branding, setBranding] = useState({
    logoUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    faviconUrl: '',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Default)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Raleway', label: 'Raleway' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
  ]

  const handleColorChange = (key: string, value: string) => {
    setBranding((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In production, this would upload to cloud storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setBranding((prev) => ({ ...prev, logoUrl: reader.result as string }))
        setSaved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    // In production, this would call an API to save branding
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding Settings</h1>
          <p className="text-gray-600">Customize your institution's look and feel</p>
        </div>
        <div className="flex items-center space-x-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              {branding.logoUrl ? (
                <div className="space-y-4">
                  <img
                    src={branding.logoUrl}
                    alt="Institution Logo"
                    className="max-h-32 mx-auto"
                  />
                  <div className="flex justify-center space-x-3">
                    <label className="cursor-pointer px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
                      Change Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setBranding((prev) => ({ ...prev, logoUrl: '' }))}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 200x50px, PNG or SVG
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Colors</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Used for buttons, links, and accents</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Used for headers and navigation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Used for highlights and notifications</p>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Typography</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={branding.fontFamily}
              onChange={(e) => {
                setBranding((prev) => ({ ...prev, fontFamily: e.target.value }))
                setSaved(false)
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <p style={{ fontFamily: branding.fontFamily }} className="text-lg">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontFamily: branding.fontFamily }} className="text-sm text-gray-500 mt-2">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
          <div
            className="border rounded-lg overflow-hidden"
            style={{
              fontFamily: branding.fontFamily,
              '--preview-primary': branding.primaryColor,
              '--preview-secondary': branding.secondaryColor,
              '--preview-accent': branding.accentColor,
            } as React.CSSProperties}
          >
            {/* Preview Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ backgroundColor: branding.secondaryColor }}
            >
              <div className="flex items-center">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-8" />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    I
                  </div>
                )}
                <span className="ml-3 text-white font-medium">Your Institution</span>
              </div>
              <div className="flex space-x-4 text-white/80 text-sm">
                <span>Home</span>
                <span>Courses</span>
                <span>About</span>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6 bg-gray-50">
              <div
                className="h-32 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-2xl"
                style={{ background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})` }}
              >
                Welcome to Your Institution
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${branding.primaryColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: branding.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">Featured Course</h3>
                  <p className="text-sm text-gray-500 mt-1">Learn something new today</p>
                  <button
                    className="mt-3 px-4 py-2 rounded-lg text-white text-sm font-medium w-full"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    View Course
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${branding.accentColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: branding.accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">Get Started</h3>
                  <p className="text-sm text-gray-500 mt-1">Join thousands of learners</p>
                  <button
                    className="mt-3 px-4 py-2 rounded-lg text-white text-sm font-medium w-full"
                    style={{ backgroundColor: branding.accentColor }}
                  >
                    Sign Up Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS (Optional Advanced Feature) */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Custom CSS</h2>
            <p className="text-sm text-gray-500">Add custom styles for advanced customization</p>
          </div>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => document.getElementById('custom-css')?.classList.toggle('hidden')}
          >
            Show Editor
          </button>
        </div>
        <textarea
          id="custom-css"
          className="hidden w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500"
          placeholder="/* Add your custom CSS here */&#10;.my-custom-class {&#10;  color: red;&#10;}"
        />
      </div>
    </div>
  )
}
