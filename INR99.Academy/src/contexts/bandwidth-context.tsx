"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type BandwidthMode = 'auto' | 'low' | 'high'

interface BandwidthContextType {
  bandwidthMode: BandwidthMode
  setBandwidthMode: (mode: BandwidthMode) => void
  isLowBandwidth: boolean
  effectiveMode: 'video' | 'audio' | 'text'
  autoDetectBandwidth: () => Promise<void>
}

const BandwidthContext = createContext<BandwidthContextType | undefined>(undefined)

export function BandwidthProvider({ children }: { children: ReactNode }) {
  const [bandwidthMode, setBandwidthMode] = useState<BandwidthMode>('auto')
  const [effectiveMode, setEffectiveMode] = useState<'video' | 'audio' | 'text'>('video')

  // Auto-detect bandwidth based on network conditions
  const autoDetectBandwidth = async () => {
    try {
      // Simple bandwidth detection using navigator.connection if available
      const connection = (navigator as any).connection
      
      if (connection) {
        const effectiveType = connection.effectiveType
        const saveData = connection.saveData
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
          setEffectiveMode('text')
        } else if (effectiveType === '3g') {
          setEffectiveMode('audio')
        } else {
          setEffectiveMode('video')
        }
      } else {
        // Fallback: use a simple download test
        const startTime = Date.now()
        const response = await fetch('/api/bandwidth-test', { 
          method: 'HEAD',
          cache: 'no-store'
        })
        const endTime = Date.now()
        const latency = endTime - startTime
        
        if (latency > 2000) {
          setEffectiveMode('text')
        } else if (latency > 1000) {
          setEffectiveMode('audio')
        } else {
          setEffectiveMode('video')
        }
      }
    } catch (error) {
      console.error('Bandwidth detection error:', error)
      setEffectiveMode('video') // Default to video mode
    }
  }

  // Update effective mode based on bandwidth mode setting
  useEffect(() => {
    const updateEffectiveMode = async () => {
      if (bandwidthMode === 'low') {
        setEffectiveMode('text')
      } else if (bandwidthMode === 'high') {
        setEffectiveMode('video')
      } else {
        await autoDetectBandwidth()
      }
    }

    updateEffectiveMode()
  }, [bandwidthMode])

  // Auto-detect on mount and when network changes
  useEffect(() => {
    if (bandwidthMode === 'auto') {
      autoDetectBandwidth()
      
      // Listen for network changes if available
      const connection = (navigator as any).connection
      if (connection) {
        const handleChange = () => autoDetectBandwidth()
        connection.addEventListener('change', handleChange)
        
        return () => {
          connection.removeEventListener('change', handleChange)
        }
      }
    }
  }, [bandwidthMode])

  const isLowBandwidth = effectiveMode === 'text'

  const value: BandwidthContextType = {
    bandwidthMode,
    setBandwidthMode,
    isLowBandwidth,
    effectiveMode,
    autoDetectBandwidth
  }

  return (
    <BandwidthContext.Provider value={value}>
      {children}
    </BandwidthContext.Provider>
  )
}

export function useBandwidth() {
  const context = useContext(BandwidthContext)
  if (context === undefined) {
    throw new Error('useBandwidth must be used within a BandwidthProvider')
  }
  return context
}