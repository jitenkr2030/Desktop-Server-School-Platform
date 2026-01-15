import { NextRequest, NextResponse } from 'next/server'
import {
  getLessonContentInLanguage,
  getAvailableTranslationsForLesson,
  getSupportedLanguages,
  getLessonById
} from '@/lib/simple-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const lessonId = (await params).id
  const { searchParams } = new URL(request.url)
  const language = searchParams.get('language') || 'en'

  try {
    const lesson = getLessonById(lessonId)
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    const content = getLessonContentInLanguage(lessonId, language)
    const availableTranslations = getAvailableTranslationsForLesson(lessonId)
    const supportedLanguages = getSupportedLanguages()
    const isTranslationAvailable = availableTranslations.includes(language)
    const currentLanguage = getSupportedLanguages().find(l => l.code === language)

    return NextResponse.json({
      success: true,
      data: {
        lessonId,
        originalTitle: lesson.title,
        originalContent: lesson.content,
        title: content?.title || lesson.title,
        content: content?.content || lesson.content,
        currentLanguage: {
          code: language,
          name: currentLanguage?.name || 'English',
          nativeName: currentLanguage?.nativeName || 'English',
          isTranslation: isTranslationAvailable && language !== 'en'
        },
        availableLanguages: availableTranslations,
        allLanguages: supportedLanguages
      }
    })
  } catch (error) {
    console.error('Error fetching lesson translation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson translation' },
      { status: 500 }
    )
  }
}
