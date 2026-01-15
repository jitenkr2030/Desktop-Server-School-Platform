'use client'

import { useState, useEffect } from 'react'

interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
  isDefault: boolean
}

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (languageCode: string) => void
  availableLanguages?: string[]
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  availableLanguages = ['en', 'hi']
}: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<SupportedLanguage[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Fetch supported languages
    fetch('/api/languages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLanguages(data.data)
        }
      })
      .catch(() => {
        // Fallback to default languages
        setLanguages([
          { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isDefault: true },
          { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', isDefault: false },
          { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isDefault: false },
          { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isDefault: false },
          { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', isDefault: false },
          { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isDefault: false }
        ])
      })
  }, [])

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0]

  const filteredLanguages = languages.filter(lang =>
    availableLanguages.includes(lang.code) || lang.code === 'en'
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentLang?.isDefault ? 'English' : currentLang?.nativeName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            {filteredLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  currentLanguage === lang.code ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-medium ${
                    currentLanguage === lang.code ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {lang.nativeName}
                  </span>
                  {lang.code !== 'en' && (
                    <span className="text-xs text-gray-400">{lang.name}</span>
                  )}
                </div>
                {currentLanguage === lang.code && (
                  <svg className="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
