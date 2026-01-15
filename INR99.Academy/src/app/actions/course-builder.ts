'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

// ==================== Course Actions ====================

export async function createCourse(data: {
  title: string
  description: string
  categoryId?: string
  difficulty?: string
  courseType?: string
}) {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  const instructor = await db.instructor.findUnique({
    where: { id: session.user.id }
  })

  if (!instructor) {
    return { error: 'Instructor profile not found' }
  }

  const course = await db.course.create({
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      difficulty: data.difficulty as any || 'BEGINNER',
      courseType: data.courseType as any || 'GENERAL',
      instructorId: instructor.id
    }
  })

  revalidatePath('/instructor/courses')
  return { success: true, course }
}

export async function updateCourse(courseId: string, data: Partial<{
  title: string
  description: string
  thumbnail: string
  difficulty: string
  courseType: string
  categoryId: string
  price: number
  isPublished: boolean
}>) {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  const course = await db.course.update({
    where: { id: courseId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.thumbnail && { thumbnail: data.thumbnail }),
      ...(data.difficulty && { difficulty: data.difficulty as any }),
      ...(data.courseType && { courseType: data.courseType as any }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished })
    }
  })

  revalidatePath('/instructor/courses')
  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true, course }
}

export async function deleteCourse(courseId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  await db.course.delete({
    where: { id: courseId }
  })

  revalidatePath('/instructor/courses')
  return { success: true }
}

export async function getCourse(courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      },
      lessons: {
        where: { moduleId: null },
        orderBy: { order: 'asc' }
      },
      instructor: true
    }
  })

  return course
}

// ==================== Module Actions ====================

export async function createModule(courseId: string, data: { title: string; description?: string }) {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  // Get the next order number
  const lastModule = await db.module.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' }
  })
  const newOrder = (lastModule?.order || 0) + 1

  const module = await db.module.create({
    data: {
      title: data.title,
      description: data.description,
      courseId,
      order: newOrder
    },
    include: {
      lessons: true
    }
  })

  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true, module }
}

export async function updateModule(moduleId: string, data: { title?: string; description?: string; order?: number }) {
  const module = await db.module.update({
    where: { id: moduleId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.order !== undefined && { order: data.order })
    },
    include: {
      lessons: true
    }
  })

  revalidatePath(`/instructor/courses/${module.courseId}`)
  return { success: true, module }
}

export async function deleteModule(moduleId: string) {
  const module = await db.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true }
  })

  if (module) {
    await db.module.delete({
      where: { id: moduleId }
    })
    revalidatePath(`/instructor/courses/${module.courseId}`)
  }

  return { success: true }
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  await Promise.all(
    moduleIds.map((id, index) =>
      db.module.update({
        where: { id },
        data: { order: index + 1 }
      })
    )
  )

  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true }
}

// ==================== Lesson Actions ====================

export async function createLesson(
  courseId: string,
  data: {
    title: string
    content?: string
    type?: 'VIDEO' | 'AUDIO' | 'TEXT' | 'QUIZ' | 'PPTX'
    moduleId?: string
    isFree?: boolean
  }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  // Determine which parent to add lesson to
  const targetId = data.moduleId || courseId
  const isInModule = !!data.moduleId

  // Get the next order number
  const lastLesson = await db.lesson.findFirst({
    where: isInModule
      ? { moduleId: data.moduleId }
      : { courseId, moduleId: null },
    orderBy: { order: 'desc' }
  })
  const newOrder = (lastLesson?.order || 0) + 1

  const lesson = await db.lesson.create({
    data: {
      title: data.title,
      content: data.content,
      type: (data.type || 'VIDEO') as any,
      courseId,
      moduleId: data.moduleId || null,
      order: newOrder,
      isFree: data.isFree || false
    }
  })

  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true, lesson }
}

export async function updateLesson(lessonId: string, data: Partial<{
  title: string
  content: string
  type: string
  videoUrl: string
  audioUrl: string
  pdfUrl: string
  thumbnailUrl: string
  duration: number
  isFree: boolean
  isPublished: boolean
  order: number
}>) {
  const lesson = await db.lesson.update({
    where: { id: lessonId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.type && { type: data.type as any }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.audioUrl !== undefined && { audioUrl: data.audioUrl }),
      ...(data.pdfUrl !== undefined && { pdfUrl: data.pdfUrl }),
      ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.isFree !== undefined && { isFree: data.isFree }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(data.order !== undefined && { order: data.order })
    }
  })

  revalidatePath(`/instructor/courses/${lesson.courseId}`)
  return { success: true, lesson }
}

export async function deleteLesson(lessonId: string) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { courseId: true }
  })

  if (lesson) {
    await db.lesson.delete({
      where: { id: lessonId }
    })
    revalidatePath(`/instructor/courses/${lesson.courseId}`)
  }

  return { success: true }
}

export async function reorderLessons(
  courseId: string,
  lessonData: Array<{ lessonId: string; moduleId: string | null; order: number }>
) {
  await Promise.all(
    lessonData.map((item) =>
      db.lesson.update({
        where: { id: item.lessonId },
        data: {
          moduleId: item.moduleId,
          order: item.order
        }
      })
    )
  )

  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true }
}

export async function moveLessonToModule(lessonId: string, moduleId: string | null) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { courseId: true }
  })

  if (lesson) {
    await db.lesson.update({
      where: { id: lessonId },
      data: { moduleId }
    })

    revalidatePath(`/instructor/courses/${lesson.courseId}`)
  }

  return { success: true }
}

// ==================== Conversion Job Actions ====================

export async function getConversionJob(lessonId: string) {
  const job = await db.conversionJob.findUnique({
    where: { lessonId }
  })
  return job
}

export async function createConversionJob(
  lessonId: string,
  data: {
    sourceFileUrl: string
    sourceFileName: string
    targetFormat: 'VIDEO' | 'AUDIO' | 'BOTH'
  }
) {
  const job = await db.conversionJob.create({
    data: {
      lessonId,
      sourceFileUrl: data.sourceFileUrl,
      sourceFileName: data.sourceFileName,
      targetFormat: data.targetFormat as any,
      status: 'PENDING'
    }
  })

  // Update lesson type to PPTX
  await db.lesson.update({
    where: { id: lessonId },
    data: { type: 'PPTX' }
  })

  return { success: true, job }
}

export async function updateConversionJob(
  jobId: string,
  data: {
    status?: string
    outputVideoUrl?: string
    outputAudioUrl?: string
    errorMessage?: string
    progress?: number
    cost?: number
  }
) {
  const job = await db.conversionJob.findUnique({
    where: { id: jobId },
    include: { lesson: true }
  })

  if (!job) {
    return { error: 'Job not found' }
  }

  await db.conversionJob.update({
    where: { id: jobId },
    data: {
      ...(data.status && { status: data.status as any }),
      ...(data.outputVideoUrl !== undefined && { outputVideoUrl: data.outputVideoUrl }),
      ...(data.outputAudioUrl !== undefined && { outputAudioUrl: data.outputAudioUrl }),
      ...(data.errorMessage !== undefined && { errorMessage: data.errorMessage }),
      ...(data.progress !== undefined && { progress: data.progress }),
      ...(data.cost !== undefined && { cost: data.cost }),
      ...(data.status === 'COMPLETED' && { completedAt: new Date() })
    }
  })

  // Update lesson with generated media URLs
  if (data.status === 'COMPLETED') {
    await db.lesson.update({
      where: { id: job.lessonId },
      data: {
        videoUrl: data.outputVideoUrl || job.outputVideoUrl,
        audioUrl: data.outputAudioUrl || job.outputAudioUrl,
        type: job.targetFormat === 'AUDIO' ? 'AUDIO' : 'VIDEO'
      }
    })
  }

  revalidatePath(`/instructor/courses/${job.lesson.courseId}`)
  return { success: true }
}

// ==================== Get Courses for Instructor ====================

export async function getInstructorCourses() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  const instructor = await db.instructor.findUnique({
    where: { id: session.user.id }
  })

  if (!instructor) {
    return { error: 'Instructor profile not found' }
  }

  const courses = await db.course.findMany({
    where: { instructorId: instructor.id },
    include: {
      modules: {
        include: {
          _count: {
            select: { lessons: true }
          }
        }
      },
      _count: {
        select: {
          lessons: true,
          modules: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return courses
}

// ==================== Get Public Instructors ====================

export async function getPublicInstructors() {
  try {
    const instructors = await db.instructorProfile.findMany({
      where: {
        isApproved: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { totalStudents: 'desc' }
      ]
    })

    return instructors.map(profile => ({
      id: profile.id,
      name: profile.user.name || 'Anonymous Instructor',
      avatar: profile.user.avatar || profile.avatar,
      bio: profile.bio,
      expertise: profile.expertise,
      experience: profile.experience,
      qualifications: profile.qualifications,
      rating: profile.rating,
      totalStudents: profile.totalStudents,
      totalCourses: profile.totalCourses
    }))
  } catch (error) {
    console.error('Error fetching public instructors:', error)
    return []
  }
}
