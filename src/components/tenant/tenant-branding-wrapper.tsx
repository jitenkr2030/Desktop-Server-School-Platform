import { TenantBrandingProvider, TenantBranding } from './tenant-branding-provider'
import { ReactNode } from 'react'

interface TenantBrandingWrapperProps {
  children: ReactNode
  branding: {
    primaryColor: string | null
    secondaryColor: string | null
    accentColor: string | null
    backgroundColor: string | null
    textColor: string | null
    fontFamily: string | null
    logoUrl: string | null
    faviconUrl: string | null
    customCss: string | null
  } | null
}

export function TenantBrandingWrapper({ children, branding }: TenantBrandingWrapperProps) {
  if (!branding) {
    return <>{children}</>
  }

  const tenantBranding: TenantBranding = {
    primaryColor: branding.primaryColor || '#3b82f6',
    secondaryColor: branding.secondaryColor || '#1e40af',
    accentColor: branding.accentColor || '#f59e0b',
    backgroundColor: branding.backgroundColor || '#ffffff',
    textColor: branding.textColor || '#1f2937',
    fontFamily: branding.fontFamily || 'Inter',
    logoUrl: branding.logoUrl,
    faviconUrl: branding.faviconUrl,
    customCss: branding.customCss,
  }

  return (
    <TenantBrandingProvider branding={tenantBranding}>
      {children}
    </TenantBrandingProvider>
  )
}
