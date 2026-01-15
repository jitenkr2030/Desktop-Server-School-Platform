// Multi-Language Support Infrastructure for Verification Portal

import { prisma } from '@/lib/db'

// Supported Languages
export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa'

interface LanguageConfig {
  code: SupportedLanguage
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  flag: string
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', flag: '🇮🇳' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', flag: '🇮🇳' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', flag: '🇮🇳' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', flag: '🇮🇳' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', flag: '🇮🇳' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', flag: '🇮🇳' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', flag: '🇮🇳' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', flag: '🇮🇳' }
}

// Translation Keys
export type TranslationKey =
  | 'verification_title'
  | 'verification_subtitle'
  | 'status_pending'
  | 'status_under_review'
  | 'status_approved'
  | 'status_rejected'
  | 'status_requires_more_info'
  | 'deadline_approaching'
  | 'deadline_passed'
  | 'days_remaining'
  | 'upload_document'
  | 'delete_document'
  | 'view_document'
  | 'document_required'
  | 'document_optional'
  | 'upload_success'
  | 'upload_failed'
  | 'file_too_large'
  | 'invalid_file_type'
  | 'review_notes'
  | 'submit_verification'
  | 'need_help'
  | 'contact_support'
  | 'document_requirements'
  | 'welcome_message'
  | 'complete_verification'
  | 'maintain_full_access'
  | 'feature_restricted'
  | 'verification_approved_message'
  | 'verification_rejected_message'
  | 'additional_info_required'
  | 'submit_additional_documents'
  | 'approval_certificate'
  | 'recognition_letter'
  | 'government_approval'
  | 'enrollment_data'
  | 'student_id_samples'
  | 'institution_registration'
  | 'university_affiliation'
  | 'other_documents'
  | 'max_file_size'
  | 'accepted_formats'
  | 'processing_time'
  | 'thank_you'
  | 'application_received'
  | 'under_review_message'
  | 'approved_message'
  | 'rejected_message'
  | 'reminder_subject'
  | 'deadline_warning_subject'
  | 'final_notice_subject'

// Translation Store
interface TranslationStore {
  [key: string]: Record<SupportedLanguage, string>
}

export const TRANSLATIONS: TranslationStore = {
  verification_title: {
    en: 'Verification Portal',
    hi: 'सत्यापन पोर्टल',
    ta: 'சரிபார்ப்பு போர்டல்',
    te: 'ధ్రువీకరణ పోర్టల్',
    bn: 'যাচাই পোর্টাল',
    mr: 'सत्यापन पोर्टल',
    gu: 'સર્ટિફિકेशન पोर्टल',
    kn: 'ಪರಿಶೀಲನೆ ಪೋರ್ಟಲ್',
    ml: 'സ്ഥിരീകരണ പോർട്ടൽ',
    pa: 'ਵੈਰੀਫਿਕੇਸ਼ਨ ਪੋਰਟਲ'
  },
  status_pending: {
    en: 'Pending Review',
    hi: 'समीक्षा लंबित',
    ta: 'ஆய்வு நிலுவையில்',
    te: 'సమీక్షలో ఉంది',
    bn: 'পর্যালোচনা অপেক্ষারত',
    mr: 'समीक्षा प्रलंबित',
    gu: 'સમીક્ષ પेंडિંગ',
    kn: 'ಸಮೀಕ್ಷೆ ಬಾಕಿ',
    ml: 'അവലോകനത്തിലിരിക്കുന്നു',
    pa: 'ਸਮੀਖਿਆ ਲੰਬਿਤ'
  },
  status_approved: {
    en: 'Approved',
    hi: 'अनुमोदित',
    ta: 'அனுமதிக்கப்பட்ட',
    te: 'అనుమతించబడిన',
    bn: 'অনুমোদিত',
    mr: 'मंजूर',
    gu: 'મંજૂર',
    kn: 'ಅನುಮೋದಿತ',
    ml: 'അംഗീകৃത',
    pa: 'ਪ੍ਰਮਾਣਿਤ'
  },
  status_rejected: {
    en: 'Rejected',
    hi: 'अस्वीकृत',
    ta: 'நிராகரிக்கப்பட்ட',
    te: 'తిరస్కరించబడిన',
    bn: 'প্রত্যাখ্যাত',
    mr: 'नाकारले',
    gu: 'નકાર્યું',
    kn: 'ತಿರಸ್ಕೃತ',
    ml: 'നിരസിക്കപ്പെട്ട',
    pa: 'ਰੱਦ'
  },
  deadline_approaching: {
    en: 'Your verification deadline is approaching',
    hi: 'आपकी सत्यापन समय सीमा नज़दीक है',
    ta: 'உங்கள் சரிபார்ப்பு காலக்கெடு நெருங்கி வருகிறது',
    te: 'మీ ధ్రువీకరణ గడువు దగ్గరగా ఉంది',
    bn: 'আপনার যাচাইয়ের সময়সীমা নিকটবর্তী',
    mr: 'तुमची सत्यपद करण्याची मुदत जवळ येत आहे',
    gu: 'તમારો સર્ટિફિકेशન ડेडलाइन નજીક આવી रह્યો',
    kn: 'ನಿಮ್ಮ ಪರಿಶೀಲನೆ ಗಡುವು ಹತ್ತಿರವಾಗುತ್ತಿದೆ',
    ml: 'നിങ്ങളുടെ സ്ഥിരീകരണ സമയപരിധി അടുക്കുന്നു',
    pa: 'ਤੁਹਾਡੀ ਪੁਸਤਕੀਕਰਨ ਮਿਆਦ ਨੇੜੇ ਆ ਰਹੀ ਹੈ'
  },
  days_remaining: {
    en: 'days remaining',
    hi: 'दिन शेष',
    ta: 'நாட்கள் மீதமுள்ள',
    te: 'రోజులు మిగిలిన',
    bn: 'দিন বাকি',
    mr: 'दिवस शिल्लक',
    gu: 'દિવસ बाकी',
    kn: 'ದಿನಗಳು ಉಳಿದಿವೆ',
    ml: 'ദിവസങ്ങൾ ശേഷിക്കുന്നു',
    pa: 'ਦਿਨ ਬਾਕੀ'
  },
  upload_document: {
    en: 'Upload Document',
    hi: 'दस्तावेज़ अपलोड करें',
    ta: 'ஆவணம் பதிவேற்றவும்',
    te: 'పత్రాన్ని అప్‌లోడ్ చేయండి',
    bn: 'ডকুমেন্ট আপলোড করুন',
    mr: 'दस्तावेज़ अपलोड करा',
    gu: 'document upload करो',
    kn: 'ದಸ್ತೈವಜ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    ml: 'ര document അപ്‌ലോഡ് ചെയ്യുക',
    pa: 'ਡੋਕੂਮੈਂਟ ਅੱਪਲੋਡ ਕਰੋ'
  },
  document_required: {
    en: 'Required',
    hi: 'आवश्यक',
    ta: 'தேவை',
    te: 'తప్పనిసరి',
    bn: 'প্রয়োজনীয়',
    mr: 'आवश्यक',
    gu: 'જરૂરી',
    kn: 'ಅಗತ್ಯ',
    ml: 'ആവശ്യമായ',
    pa: 'ਲੋੜੀਂਦਾ'
  },
  document_optional: {
    en: 'Optional',
    hi: 'वैकल्पिक',
    ta: 'விருப்பம்',
    te: 'ఐచ్ఛికం',
    bn: 'ঐচ্ছিক',
    mr: 'पर्यायी',
    gu: 'વૈકલ્પિક',
    kn: 'ಐಚ್ಛಿಕ',
    ml: 'ഓപ്ഷണൽ',
    pa: 'ਵਿਕਲਪਿਕ'
  },
  approval_certificate: {
    en: 'AICTE Approval Certificate',
    hi: 'AICTE अनुमोदन प्रमाणपत्र',
    ta: 'AICTE அனுமதி சான்றிதழ்',
    te: 'AICTE ఆమోదం ధ్రువీకరణ',
    bn: 'AICTE অনুমোদন সার্টিফিকেট',
    mr: 'AICTE मंजूरी प्रमाणपत्र',
    gu: 'AICTE approval certificate',
    kn: 'AICTE ಅನುಮೋದನೆ ಪ್ರಮಾಣಪತ್ರ',
    ml: 'AICTE അംഗീകാര സര്‍ട്ടിഫിക്കറ്റ്',
    pa: 'AICTE ਪ੍ਰਮਾਣ ਪੱਤਰ'
  },
  enrollment_data: {
    en: 'Enrollment Data (Audited)',
    hi: 'नामांकन डेटा (लेखापरीक्षित)',
    ta: 'சேர்க்கை தரவு (தணிக்கை செய்யப்பட்ட)',
    te: 'enrollment data (లెక్కాపరిశీలన)',
    bn: 'ভর্তি ডেটা (নিরীক্ষিত)',
    mr: 'नोंदणी डेटा (लेखापरीक्षित)',
    gu: 'enrollment data (audited)',
    kn: 'ನೋಂದಣಿ ಡೇಟಾ (ಲೆಕ್ಕಪರಿಶೋಧಿತ)',
    ml: 'എന്‍റോള്‍മെന്റ് ഡാറ്റ (ഓഡിറ്റഡ്)',
    pa: 'ਦਾਖਲਾ ਡੇਟਾ (ਆਡਿਟ)'
  },
  complete_verification: {
    en: 'Complete Verification',
    hi: 'सत्यापन पूरा करें',
    ta: 'சரிபார்ப்பை முடிக்கவும்',
    te: 'సర్టిఫికేషన్ పూర్తి చేయండి',
    bn: 'যাচাই সম্পন্ন করুন',
    mr: 'सत्यपद पूर्ण करा',
    gu: 'verification पूरो करो',
    kn: 'ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ',
    ml: 'സ്ഥിരീകരണം പൂര്‍ത്തിയാക്കുക',
    pa: 'ਪੁਸਤਕੀਕਰਨ ਪੂਰਾ ਕਰੋ'
  },
  feature_restricted: {
    en: 'Your access to platform features is restricted',
    hi: 'प्लेटफ़ॉर्म सुविधाओं तक आपकी पहुँच प्रतिबंधित है',
    ta: 'இயங்குதள அம்சங்களுக்கான உங்கள் அணுகல் கட்டுப்படுத்தப்பட்டுள்ளது',
    te: 'ప్లాట్‌ఫాం ఫీచర్‌లకు మీ యాక్సెస్ పరిమితం చేయబడింది',
    bn: 'প্ল্যাটফর্ম বৈশিষ্ট্যগুলিতে আপনার অ্যাক্সেস সীমাবদ্ধ',
    mr: 'प्लॅटफॉर्म वैशिष्ट्यांमध्ये तुमची प्रवेश सीमित झाली आहे',
    gu: 'platform features पर access restricted छे',
    kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಫೀಚರ್‌ಗಳಿಗೆ ನಿಮ್ಮ ಪ್ರವೇಶ ಸೀಮಿತ',
    ml: 'പ്ലാറ്റ്‌ഫോം ഫീച്ചറുകളിലേക്കുള്ള നിങ്ങളുടെ ആക്‌സസ് പരിമിതപ്പെടുത്തിയിരിക്കുന്നു',
    pa: 'ਪਲੇਟਫਾਰਮ ਫੀਚਰਸ ਤੇ ਤੁਹਾਡੀ ਪਹੁੰਚ ਸੀਮਿਤ ਹੈ'
  },
  need_help: {
    en: 'Need Help?',
    hi: 'मदद चाहिए?',
    ta: 'உதவி தேவையா?',
    te: 'సహాయం కావాలా?',
    bn: 'সাহায্য প্রয়োজন?',
    mr: 'मदत हवी आहे?',
    gu: 'मदद जोઈએ?',
    kn: 'ಸಹಾಯ ಬೇಕೇ?',
    ml: 'സഹായം വേണമോ?',
    pa: 'ਮਦਦ ਚਾਹੀਦੀ ਹੈ?'
  },
  contact_support: {
    en: 'Contact Support',
    hi: 'सहायता से संपर्क करें',
    ta: 'ஆதரவைத் தொடர்பு கொள்ளவும்',
    te: 'సపోర్ట్‌ను సంప్రదించండి',
    bn: 'সাপোর্টের সাথে যোগাযোগ করুন',
    mr: 'सपोर्टशी संपर्क करा',
    gu: 'support से contact करो',
    kn: 'ಬೆಂಬಲ ಸಂಪರ್ಕಿಸಿ',
    ml: 'സപ്പോര്‍ട്ടുമായി ബന്ധപ്പെടുക',
    pa: 'ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ'
  }
}

// Translation Service
export class TranslationService {
  private defaultLanguage: SupportedLanguage = 'en'

  setDefaultLanguage(language: SupportedLanguage): void {
    this.defaultLanguage = language
  }

  translate(key: TranslationKey, language?: SupportedLanguage): string {
    const lang = language || this.defaultLanguage
    const translation = TRANSLATIONS[key]
    
    if (translation && translation[lang]) {
      return translation[lang]
    }
    
    // Fallback to English or key name
    return translation?.[this.defaultLanguage] || key
  }

  translateArray(keys: TranslationKey[], language?: SupportedLanguage): string[] {
    return keys.map(key => this.translate(key, language))
  }

  async getTranslatedContent(
    tenantId: string,
    key: TranslationKey
  ): Promise<{ content: string; language: SupportedLanguage }> {
    // Fetch tenant's preferred language
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { preferredLanguage: true }
    })

    const language: SupportedLanguage = (tenant?.preferredLanguage as SupportedLanguage) || this.defaultLanguage

    return {
      content: this.translate(key, language),
      language
    }
  }

  async setTenantLanguage(tenantId: string, language: SupportedLanguage): Promise<void> {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { preferredLanguage: language }
    })
  }

  getLanguageByCode(code: string): LanguageConfig | undefined {
    return SUPPORTED_LANGUAGES[code as SupportedLanguage]
  }

  getAllLanguages(): LanguageConfig[] {
    return Object.values(SUPPORTED_LANGUAGES)
  }

  isRTL(language: SupportedLanguage): boolean {
    return SUPPORTED_LANGUAGES[language]?.direction === 'rtl'
  }
}

// Export singleton
export const translationService = new TranslationService()
