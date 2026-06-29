import { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'
import { useCareerStore } from '../store/useCareerStore'
import { mockResumeAnalysis } from '../mocks/mockData'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.md']

function getExtension(filename: string) {
  const dotIndex = filename.lastIndexOf('.')
  return dotIndex === -1 ? '' : filename.slice(dotIndex).toLowerCase()
}

function ResumeUpload() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const setResumeAnalysis = useCareerStore((state) => state.setResumeAnalysis)

  const processFile = (file: File) => {
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
      setResumeAnalysis(mockResumeAnalysis)
      setIsAnalyzing(false)
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
      <h2 className="text-base font-bold text-slate-900 mb-3">Upload resume</h2>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`min-h-[200px] flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed cursor-pointer transition ${
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
