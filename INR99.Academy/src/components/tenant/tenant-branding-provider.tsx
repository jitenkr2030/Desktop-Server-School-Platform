'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface TenantBranding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  logoUrl?: string | null
  faviconUrl?: string | null
  customCss?: string | null
}

interface TenantBrandingContextType {
  branding: TenantBranding | null
  isLoading: boolean
}

const TenantBrandingContext = createContext<TenantBrandingContextType>({
  branding: null,
  isLoading: true,
})

interface TenantBrandingProviderProps {
  children: ReactNode
  branding: TenantBranding | null
}

export function TenantBrandingProvider({
  children,
  branding,
}: TenantBrandingProviderProps) {
  return (
    <TenantBrandingContext.Provider
      value={{
        branding,
        isLoading: false,
      }}
    >
      {children}
    </TenantBrandingContext.Provider>
  )
}

export function useTenantBranding() {
  const context = useContext(TenantBrandingContext)
  if (context === undefined) {
    throw new Error('useTenantBranding must be used within a TenantBrandingProvider')
  }
  return context
}

// Helper function to get CSS variable value
export function getCssVariable(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Helper function to set CSS variable
export function setCssVariable(name: string, value: string): void {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(name, value)
}

// Apply branding colors to document
export function applyBrandingToDocument(branding: TenantBranding): void {
  if (typeof document === 'undefined') return

  // Set CSS variables
  setCssVariable('--tenant-primary', branding.primaryColor)
  setCssVariable('--tenant-secondary', branding.secondaryColor)
  setCssVariable('--tenant-accent', branding.accentColor)
  setCssVariable('--tenant-background', branding.backgroundColor)
  setCssVariable('--tenant-foreground', branding.textColor)
  setCssVariable('--tenant-font-family', branding.fontFamily)

  // Set document styles
  document.documentElement.style.setProperty('--primary-color', branding.primaryColor)
  document.documentElement.style.setProperty('--secondary-color', branding.secondaryColor)
  document.body.style.backgroundColor = branding.backgroundColor
  document.body.style.color = branding.textColor
  document.body.style.fontFamily = `${branding.fontFamily}, system-ui, sans-serif`
}
