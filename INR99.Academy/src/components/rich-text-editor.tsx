"use client"

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Smile,
  Eye,
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showPreview?: boolean
  onFileUpload?: (file: File) => Promise<string>
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write something...", 
  className,
  showPreview = true,
  onFileUpload
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }, [value, onChange])

  const insertMarkdown = useCallback((syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || placeholder
    const newText = value.substring(0, start) + syntax.replace('[]', selectedText) + value.substring(end)
    
    onChange(newText)
  }, [value, onChange])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onFileUpload) return

    try {
      const url = await onFileUpload(file)
      insertText(`![${file.name}](${url})`)
    } catch (error) {
      console.error('File upload failed:', error)
    }
  }, [onFileUpload, insertText])

  // Common emojis for quick access
  const commonEmojis = [
    '😊', '👍', '❤️', '🎉', '💡', '🚀', '✨', '📚',
    '🤔', '✅', '❌', '🔥', '💯', '🤝', '🎯', '📈'
  ]

  const renderPreview = (text: string) => {
    // Simple markdown rendering for preview
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 underline" target="_blank">$1</a>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className={cn("border rounded-lg", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        {showPreview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8 w-8 p-0"
          >
            {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**[]**')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*[]*')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('`[]`')}
          className="h-8 w-8 p-0"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('```\n', '\n```')}
          className="h-8 w-8 p-0"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('# []', 'Heading 1')}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('## []', 'Heading 2')}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('### []', 'Heading 3')}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('- ')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('1. ')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('> ')}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) insertText(`[Link Text](${url})`)
          }}
          className="h-8 w-8 p-0"
          title="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        {onFileUpload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="h-8 w-8 p-0"
            title="Image"
          >
            <Image className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="h-8 w-8 p-0"
          title="Emoji"
        >
          <Smile className="h-4 w-4" />
        </Button>
        
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="border-b p-3 bg-white">
          <div className="flex flex-wrap gap-2">
            {commonEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  insertText(emoji)
                  setShowEmojiPicker(false)
                }}
                className="h-8 w-8 p-0 text-lg hover:bg-gray-100"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[200px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] border-0 resize-none focus:ring-0"
          />
        )}
      </div>
    </div>
  )
}

// Hook for file upload functionality
export function useFileUpload() {
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    // In a real implementation, you would upload to a storage service
    // For demo purposes, we'll return a placeholder URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/uploads/${Date.now()}-${file.name}`)
      }, 1000)
    })
  }, [])

  return { uploadFile }
}