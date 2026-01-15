"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  Trophy,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  BookOpen
} from "lucide-react"

interface Question {
  id: string
  question: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'
  options?: string[]
  explanation?: string
}

interface Assessment {
  id: string
  title: string
  type: 'QUIZ' | 'PRACTICE' | 'SCENARIO'
  course: {
    id: string
    title: string
  }
  lesson?: {
    id: string
    title: string
  }
  questions: Question[]
  alreadyCompleted?: boolean
  previousScore?: number
}

interface AssessmentResult {
  id: string
  score: number
  correctAnswers: number
  totalQuestions: number
  passed: boolean
  assessment: {
    id: string
    title: string
    type: string
  }
}

interface AssessmentPlayerProps {
  assessment: Assessment
  onComplete: (result: AssessmentResult) => void
  onExit?: () => void
}

export function AssessmentPlayer({ assessment, onComplete, onExit }: AssessmentPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | string[])[]>(Array(assessment.questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(assessment.questions.length * 60) // 1 minute per question
  const [startTime] = useState(Date.now())

  const currentQuestion = assessment.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (showResults || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showResults, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (answer: string | string[]) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/assessments/${assessment.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: answers
        })
      })

      const data = await response.json()

      if (data.success) {
        onComplete(data.result)
        setShowResults(true)
      } else {
        console.error('Failed to submit assessment:', data.message)
      }
    } catch (error) {
      console.error('Submit assessment error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = answers[currentQuestionIndex] !== null && answers[currentQuestionIndex] !== ''
  const allQuestionsAnswered = answers.every(answer => answer !== null && answer !== '')

  const renderQuestion = (question: Question, index: number) => {
    const userAnswer = answers[index]

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            <RadioGroup 
              value={userAnswer as string || ''} 
              onValueChange={handleAnswerChange}
            >
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${optionIndex}`} />
                  <Label htmlFor={`option-${optionIndex}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            <RadioGroup 
              value={userAnswer as string || ''} 
              onValueChange={handleAnswerChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 'SHORT_ANSWER':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Type your answer here..."
              value={userAnswer as string || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full"
            />
          </div>
        )

      default:
        return null
    }
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {Math.round(onComplete?.score || 0)}%
              </div>
              <Badge 
                variant={onComplete?.passed ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {onComplete?.passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {onComplete?.correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {onComplete?.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>

            {onComplete?.passed && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Congratulations! You've successfully completed the assessment and earned a skill badge.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowResults(false)
                  setCurrentQuestionIndex(0)
                  setAnswers(Array(assessment.questions.length).fill(null))
                  setTimeRemaining(assessment.questions.length * 60)
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Assessment
              </Button>
              <Button 
                className="flex-1"
                onClick={onExit}
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {assessment.course.title}
              </span>
              {assessment.lesson && (
                <span>• Lesson: {assessment.lesson.title}</span>
              )}
              <Badge variant="outline">{assessment.type}</Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining < 60 ? 'text-red-600 font-medium' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            {assessment.alreadyCompleted && assessment.previousScore && (
              <div className="text-xs text-gray-500">
                Previous attempt: {Math.round(assessment.previousScore)}%
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderQuestion(currentQuestion, currentQuestionIndex)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          {answers.filter(a => a !== null && a !== '').length} of {assessment.questions.length} answered
        </div>

        {currentQuestionIndex === assessment.questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-green-500 hover:bg-green-600"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canSubmit}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {assessment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-orange-500 text-white border-orange-500'
                  : answers[index] !== null && answers[index] !== ''
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Submit All Button */}
      {allQuestionsAnswered && currentQuestionIndex < assessment.questions.length - 1 && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600"
          >
            {isSubmitting ? 'Submitting...' : 'Submit All Answers'}
          </Button>
        </div>
      )}
    </div>
  )
}