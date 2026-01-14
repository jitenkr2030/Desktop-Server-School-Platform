// ============================================
// DYNAMIC BRANDING CSS GENERATOR
// Generates tenant-specific CSS variables and styles
// ============================================

import type { TenantBranding } from '@prisma/client';

export interface BrandingTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
}

// Convert hex to Oklch for CSS variables (better color manipulation)
export function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Convert RGB to OKLCH
  // Using a simplified conversion for CSS
  return hex; // Fallback to hex for now
}

// Generate CSS variables from branding configuration
export function generateBrandingCssVariables(
  branding: BrandingTheme,
  options: { prefix?: string; includeBase?: boolean } = {}
): string {
  const { prefix = '--tenant', includeBase = true } = options;
  
  const vars: string[] = [];
  
  if (includeBase) {
    vars.push(`${prefix}-primary: ${branding.primaryColor};`);
    vars.push(`${prefix}-primary-foreground: #ffffff;`);
    vars.push(`${prefix}-secondary: ${branding.secondaryColor};`);
    vars.push(`${prefix}-secondary-foreground: #ffffff;`);
    vars.push(`${prefix}-accent: ${branding.accentColor};`);
    vars.push(`${prefix}-accent-foreground: #000000;`);
    vars.push(`${prefix}-background: ${branding.backgroundColor};`);
    vars.push(`${prefix}-foreground: ${branding.textColor};`);
    vars.push(`${prefix}-font-family: ${branding.fontFamily};`);
  } else {
    vars.push(`${prefix}-color-primary: ${branding.primaryColor};`);
    vars.push(`${prefix}-color-secondary: ${branding.secondaryColor};`);
    vars.push(`${prefix}-color-accent: ${branding.accentColor};`);
    vars.push(`${prefix}-font: ${branding.fontFamily};`);
  }
  
  return vars.join('\n  ');
}

// Generate complete branded CSS with Tailwind integration
export function generateBrandedCss(branding: BrandingTheme): string {
  const cssVariables = generateBrandingCssVariables(branding);
  
  // Generate CSS override block
  return `/* Tenant Branding CSS - Auto-generated */
:root {
  ${cssVariables}
}

/* Primary color variations for hover states */
.brand-hover-primary:hover {
  background-color: ${adjustColor(branding.primaryColor, -10)} !important;
}

.brand-text-primary {
  color: ${branding.primaryColor} !important;
}

.brand-bg-primary {
  background-color: ${branding.primaryColor} !important;
}

.brand-border-primary {
  border-color: ${branding.primaryColor} !important;
}

/* Secondary color variations */
.brand-hover-secondary:hover {
  background-color: ${adjustColor(branding.secondaryColor, -10)} !important;
}

.brand-text-secondary {
  color: ${branding.secondaryColor} !important;
}

.brand-bg-secondary {
  background-color: ${branding.secondaryColor} !important;
}

/* Accent color for CTAs and highlights */
.brand-text-accent {
  color: ${branding.accentColor} !important;
}

.brand-bg-accent {
  background-color: ${branding.accentColor} !important;
}

/* Custom font family */
.brand-font {
  font-family: ${branding.fontFamily}, system-ui, sans-serif !important;
}

/* Custom logo styles */
.brand-logo {
  max-height: 48px;
  width: auto;
}

/* Gradient backgrounds */
.brand-gradient {
  background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor}) !important;
}

.brand-gradient-text {
  background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Button styles */
.brand-btn-primary {
  background-color: ${branding.primaryColor} !important;
  color: #ffffff !important;
  border: none !important;
}

.brand-btn-primary:hover {
  background-color: ${adjustColor(branding.primaryColor, -10)} !important;
}

.brand-btn-secondary {
  background-color: ${branding.secondaryColor} !important;
  color: #ffffff !important;
  border: none !important;
}

/* Card and container styles */
.brand-card {
  border-top: 3px solid ${branding.primaryColor} !important;
}

.brand-card-header {
  background-color: ${branding.primaryColor} !important;
  color: #ffffff !important;
}

/* Navigation styles */
.brand-nav {
  border-bottom: 2px solid ${branding.primaryColor} !important;
}

.brand-nav-link:hover {
  color: ${branding.primaryColor} !important;
  border-bottom-color: ${branding.primaryColor} !important;
}

/* Form styles */
.brand-input:focus {
  border-color: ${branding.primaryColor} !important;
  box-shadow: 0 0 0 2px ${branding.primaryColor}20 !important;
}

.brand-select:focus {
  border-color: ${branding.primaryColor} !important;
}

/* Link styles */
.brand-link {
  color: ${branding.primaryColor} !important;
}

.brand-link:hover {
  color: ${adjustColor(branding.primaryColor, -20)} !important;
}

/* Badge and indicator styles */
.brand-badge {
  background-color: ${branding.primaryColor}15 !important;
  color: ${branding.primaryColor} !important;
  border: 1px solid ${branding.primaryColor}30 !important;
}

/* Progress bar styles */
.brand-progress-bar {
  background-color: ${branding.primaryColor} !important;
}

/* Custom CSS from tenant configuration */
${branding.customCss || ''}
`;
}

// Lighten or darken a color
function adjustColor(hex: string, percent: number): string {
  hex = hex.replace('#', '');
  
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Convert to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  // Adjust lightness
  l += percent / 100;
  const newL = Math.max(0, Math.min(1, l));
  
  // Convert back to RGB
  let r1: number, g1: number, b1: number;
  
  if (s === 0) {
    r1 = g1 = b1 = newL;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
    const p = 2 * newL - q;
    r1 = hue2rgb(p, q, h + 1 / 3);
    g1 = hue2rgb(p, q, h);
    b1 = hue2rgb(p, q, h - 1 / 3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

// Generate inline styles for React components
export function generateInlineStyles(branding: BrandingTheme): Record<string, string> {
  return {
    '--tenant-primary': branding.primaryColor,
    '--tenant-secondary': branding.secondaryColor,
    '--tenant-accent': branding.accentColor,
    '--tenant-font': branding.fontFamily,
    fontFamily: branding.fontFamily,
  };
}

// Generate Tailwind config override
export function generateTailwindConfig(branding: BrandingTheme): Record<string, unknown> {
  return {
    theme: {
      extend: {
        colors: {
          brand: {
            primary: branding.primaryColor,
            secondary: branding.secondaryColor,
            accent: branding.accentColor,
          },
        },
        fontFamily: {
          brand: [branding.fontFamily, 'system-ui', 'sans-serif'],
        },
      },
    },
  };
}

// Validate branding colors
export function validateBrandingColors(branding: Partial<BrandingTheme>): string[] {
  const errors: string[] = [];
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
  const colorFields: { key: keyof BrandingTheme; name: string }[] = [
    { key: 'primaryColor', name: 'Primary color' },
    { key: 'secondaryColor', name: 'Secondary color' },
    { key: 'accentColor', name: 'Accent color' },
    { key: 'backgroundColor', name: 'Background color' },
    { key: 'textColor', name: 'Text color' },
  ];
  
  for (const field of colorFields) {
    const value = branding[field.key];
    if (value && !colorRegex.test(value)) {
      errors.push(`${field.name} must be a valid hex color (e.g., #3b82f6)`);
    }
  }
  
  return errors;
}

// Generate preview HTML for branding
export function generateBrandingPreview(branding: BrandingTheme): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Branding Preview</title>
  <style>
    :root {
      ${generateBrandingCssVariables(branding)}
    }
    
    body {
      font-family: ${branding.fontFamily}, system-ui, sans-serif;
      margin: 0;
      padding: 40px;
      background-color: ${branding.backgroundColor};
      color: ${branding.textColor};
    }
    
    .preview-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .brand-header {
      background: linear-gradient(135deg, var(--tenant-primary), var(--tenant-secondary));
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .brand-logo {
      max-height: 60px;
      margin-bottom: 15px;
    }
    
    .brand-title {
      color: #ffffff;
      font-size: 28px;
      margin: 0;
    }
    
    .brand-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-top: 4px solid var(--tenant-primary);
    }
    
    .brand-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    
    .brand-button-primary {
      background-color: var(--tenant-primary);
      color: #ffffff;
    }
    
    .brand-button-secondary {
      background-color: var(--tenant-secondary);
      color: #ffffff;
    }
    
    .brand-button-accent {
      background-color: var(--tenant-accent);
      color: #000000;
    }
    
    .brand-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background-color: var(--tenant-primary);
      color: #ffffff;
    }
    
    .brand-input {
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      width: 100%;
      max-width: 300px;
      margin-bottom: 15px;
    }
    
    .brand-input:focus {
      outline: none;
      border-color: var(--tenant-primary);
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="brand-header">
      ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="Logo" class="brand-logo">` : ''}
      <h1 class="brand-title">${branding.fontFamily} Preview</h1>
    </div>
    
    <div class="brand-card">
      <h2 style="margin-top: 0; color: var(--tenant-secondary);">Primary Button</h2>
      <button class="brand-button brand-button-primary">Primary Action</button>
      <button class="brand-button brand-button-secondary">Secondary Action</button>
      <button class="brand-button brand-button-accent">Accent</button>
    </div>
    
    <div class="brand-card">
      <h2 style="margin-top: 0; color: var(--tenant-secondary);">Form Elements</h2>
      <input type="text" class="brand-input" placeholder="Text input">
      <br>
      <span class="brand-badge">Badge Label</span>
    </div>
  </div>
</body>
</html>`;
}

export type { BrandingTheme };
