"use client"

import { useBandwidth } from '@/contexts/bandwidth-context'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalLow, 
  SignalMedium, 
  SignalHigh,
  Settings,
  Loader2
} from "lucide-react"
import { useState } from "react"

export function BandwidthToggle() {
  const { 
    bandwidthMode, 
    setBandwidthMode, 
    isLowBandwidth, 
    effectiveMode, 
    autoDetectBandwidth 
  } = useBandwidth()
  const [isDetecting, setIsDetecting] = useState(false)

  const handleModeChange = async (mode: 'auto' | 'low' | 'high') => {
    setBandwidthMode(mode)
    if (mode === 'auto') {
      setIsDetecting(true)
      await autoDetectBandwidth()
      setIsDetecting(false)
    }
  }

  const getModeIcon = () => {
    if (isDetecting) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    
    switch (effectiveMode) {
      case 'text':
        return <SignalLow className="h-4 w-4" />
      case 'audio':
        return <SignalMedium className="h-4 w-4" />
      case 'video':
        return <SignalHigh className="h-4 w-4" />
      default:
        return <Signal className="h-4 w-4" />
    }
  }

  const getModeColor = () => {
    switch (effectiveMode) {
      case 'text':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'audio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'video':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getModeLabel = () => {
    switch (effectiveMode) {
      case 'text':
        return 'Text Only'
      case 'audio':
        return 'Audio'
      case 'video':
        return 'Video'
      default:
        return 'Auto'
    }
  }

  const getBandwidthModeLabel = () => {
    switch (bandwidthMode) {
      case 'auto':
        return 'Auto'
      case 'low':
        return 'Low'
      case 'high':
        return 'High'
      default:
        return 'Auto'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getModeIcon()}
          <span className="hidden sm:inline">Bandwidth</span>
          <Badge className={`text-xs ${getModeColor()}`}>
            {getModeLabel()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b">
          Bandwidth Mode
        </div>
        
        <DropdownMenuItem 
          onClick={() => handleModeChange('auto')}
          className={`${bandwidthMode === 'auto' ? 'bg-orange-50 text-orange-700' : ''}`}
        >
          <div className="flex items-center gap-2 w-full">
            <Wifi className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Auto</div>
              <div className="text-xs text-gray-500">Automatically detect</div>
            </div>
            {bandwidthMode === 'auto' && (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleModeChange('low')}
          className={`${bandwidthMode === 'low' ? 'bg-orange-50 text-orange-700' : ''}`}
        >
          <div className="flex items-center gap-2 w-full">
            <WifiOff className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Low</div>
              <div className="text-xs text-gray-500">Text only mode</div>
            </div>
            {bandwidthMode === 'low' && (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleModeChange('high')}
          className={`${bandwidthMode === 'high' ? 'bg-orange-50 text-orange-700' : ''}`}
        >
          <div className="flex items-center gap-2 w-full">
            <Signal className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">High</div>
              <div className="text-xs text-gray-500">Full video support</div>
            </div>
            {bandwidthMode === 'high' && (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
        </DropdownMenuItem>

        <div className="border-t pt-2 px-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Current Mode:</span>
            <Badge className={`text-xs ${getModeColor()}`}>
              {getModeLabel()}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Setting:</span>
            <span className="font-medium">{getBandwidthModeLabel()}</span>
          </div>
        </div>

        {bandwidthMode === 'auto' && (
          <DropdownMenuItem 
            onClick={autoDetectBandwidth}
            disabled={isDetecting}
            className="text-blue-600"
          >
            <div className="flex items-center gap-2 w-full">
              {isDetecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              <span>{isDetecting ? 'Detecting...' : 'Redetect Bandwidth'}</span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}