import { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'
import { mockResumeAnalysis } from '../mocks/mockData'
import type { ResumeAnalysis } from '../types'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.md']

function getExtension(filename: string) {
  const dotIndex = filename.lastIndexOf('.')
  return dotIndex === -1 ? '' : filename.slice(dotIndex).toLowerCase()
}

type ResumeUploadProps = {
  onAdd: (data: Omit<ResumeAnalysis, 'id'>) => void
}

function ResumeUpload({ onAdd }: ResumeUploadProps) {
  const [name, setName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isReady = name.trim().length > 0

  const processFile = (file: File) => {
    if (!isReady) {
      setError('Give this resume a name first.')
      return
    }
    if (!ALLOWED_EXTENSIONS.includes(getExtension(file.name))) {
      setError('Only PDF, DOCX, or Markdown files are supported.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Max size is 5MB.')
      return
    }

    setError(null)
    setFileName(file.name)
    setIsAnalyzing(true)
    setTimeout(() => {
      onAdd({
        name,
        uploadedDate: new Date().toISOString().split('T')[0],
        ...mockResumeAnalysis,
      })
      setIsAnalyzing(false)
      setName('')
      setFileName(null)
    }, 800)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">Add a resume</h2>

      <div className="mb-3">
        <label className="block text-sm font-semibold text-slate-500 mb-1">
          Resume name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Frontend resume"
          className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
        />
      </div>

      <div
        onClick={() => isReady && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (isReady) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`min-h-[200px] flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed transition ${
          isReady ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
        } ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
          <Upload size={20} />
        </div>
        <p className="font-semibold text-slate-900">
          Drop resume here or choose file
        </p>
        <p className="text-slate-500 text-sm mt-1">PDF, DOCX, MD · Max 5MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.md"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <FileText size={14} />
          {fileName}
        </div>
      )}
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      {isAnalyzing && <p className="text-slate-500 mt-3">Analyzing...</p>}
    </div>
  )
}

export default ResumeUpload
