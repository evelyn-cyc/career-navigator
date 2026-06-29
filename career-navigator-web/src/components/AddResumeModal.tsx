import { useState, useEffect, useRef } from 'react'
import { X, Upload } from 'lucide-react'
import { mockResumeAnalysis } from '../mocks/mockData'
import type { ResumeAnalysis } from '../types'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.md']

const STEPS = [
  'Reading document structure',
  'Extracting skills & technologies',
  'Identifying projects & experience',
  'Generating improvement suggestions',
]

type Tab = 'overview' | 'skills' | 'projects' | 'suggestions'
type Panel = 'upload' | 'analyzing' | 'result'

function toDisplayName(filename: string) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
}

function getExtension(filename: string) {
  const i = filename.lastIndexOf('.')
  return i === -1 ? '' : filename.slice(i).toLowerCase()
}

type AddResumeModalProps = {
  existingNames: string[]
  onAdd: (data: Omit<ResumeAnalysis, 'id'>) => void
  onClose: () => void
}

export default function AddResumeModal({
  existingNames,
  onAdd,
  onClose,
}: AddResumeModalProps) {
  const [panel, setPanel] = useState<Panel>('upload')
  const [fileName, setFileName] = useState('')
  const [step, setStep] = useState(0)
  const [resumeName, setResumeName] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Drive the step animation
  useEffect(() => {
    if (panel !== 'analyzing') return
    if (step >= STEPS.length) {
      const t = setTimeout(() => {
        setTab('overview')
        setPanel('result')
      }, 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), 680)
    return () => clearTimeout(t)
  }, [panel, step])

  const startAnalysis = (file: File) => {
    if (!ALLOWED_EXTENSIONS.includes(getExtension(file.name))) {
      setUploadError('Only PDF, DOCX, or Markdown files are supported.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File is too large. Max size is 5MB.')
      return
    }
    setUploadError(null)
    setFileName(file.name)
    setResumeName(toDisplayName(file.name))
    setStep(0)
    setNameError(null)
    setPanel('analyzing')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      startAnalysis(file)
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) startAnalysis(file)
  }

  const handleSave = () => {
    const finalName = resumeName.trim() || toDisplayName(fileName)
    if (
      existingNames.some((n) => n.toLowerCase() === finalName.toLowerCase())
    ) {
      setNameError(`"${finalName}" already exists. Choose a different name.`)
      return
    }
    onAdd({
      name: finalName,
      uploadedDate: new Date().toISOString().split('T')[0],
      ...mockResumeAnalysis,
    })
    onClose()
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-8 z-50"
    >
      <div onClick={(e) => e.stopPropagation()}>
        {/* ── Panel A: Upload ── */}
        {panel === 'upload' && (
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] p-9">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add a resume</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl px-6 py-14 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-slate-200 hover:border-violet-400 hover:bg-violet-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4 text-violet-600">
                <Upload size={26} />
              </div>
              <p className="text-base font-bold text-slate-900 mb-1">
                Drop your resume here
              </p>
              <p className="text-sm text-slate-500">
                or{' '}
                <span className="text-violet-600 font-semibold">
                  choose a file
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, DOCX, MD · Max 5MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadError && (
              <p className="text-red-600 text-sm mt-3">{uploadError}</p>
            )}
          </div>
        )}

        {/* ── Panel B: Analyzing ── */}
        {panel === 'analyzing' && (
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-11 text-center">
            <div className="w-12 h-12 border-[3px] border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Analysing your resume
            </h3>
            <p className="text-sm text-slate-500 mb-7">{fileName}</p>

            <div className="text-left flex flex-col gap-3.5">
              {STEPS.map((label, i) => {
                const done = i < step
                const active = i === step
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm transition-colors ${
                      done
                        ? 'text-slate-900'
                        : active
                          ? 'text-violet-600 font-semibold'
                          : 'text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-all ${
                        done
                          ? 'bg-green-700 border-green-700'
                          : active
                            ? 'border-violet-500'
                            : 'border-slate-200'
                      }`}
                    >
                      {done && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Panel C: Results ── */}
        {panel === 'result' && (
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] max-h-[84vh] flex flex-col overflow-hidden">
            <div className="px-7 pt-7 pb-0 border-b border-slate-200 flex-none">
              <div className="flex items-start gap-4 mb-1">
                <input
                  value={resumeName}
                  onChange={(e) => {
                    setResumeName(e.target.value)
                    setNameError(null)
                  }}
                  title="Click to rename"
                  className="text-2xl font-bold text-slate-900 bg-transparent border-0 border-b-2 border-transparent focus:border-violet-600 outline-none min-w-0 flex-1 py-0.5 transition-colors font-[inherit]"
                />
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center flex-none"
                >
                  <X size={15} />
                </button>
              </div>
              {nameError && (
                <p className="text-red-600 text-xs mb-2">{nameError}</p>
              )}
              <p className="text-sm text-slate-500 mb-4">
                Just analysed · {mockResumeAnalysis.extractedSkills.length}{' '}
                skills detected
              </p>

              <div className="flex">
                {(
                  ['overview', 'skills', 'projects', 'suggestions'] as Tab[]
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                      tab === t
                        ? 'text-violet-600 border-violet-600'
                        : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-7 py-6">
              {tab === 'overview' && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Summary
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    {mockResumeAnalysis.overview}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Top skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mockResumeAnalysis.extractedSkills
                      .slice(0, 6)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-600"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {tab === 'skills' && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    All detected skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mockResumeAnalysis.extractedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'projects' && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Projects found
                  </p>
                  {mockResumeAnalysis.projects.map((project, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl mb-2.5"
                    >
                      <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 text-sm font-bold flex items-center justify-center flex-none">
                        {project[0].toUpperCase()}
                      </div>
                      <p className="text-sm text-slate-700 leading-snug pt-1">
                        {project}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'suggestions' && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    AI suggestions
                  </p>
                  {mockResumeAnalysis.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex gap-2.5 p-3.5 rounded-xl border border-amber-200 bg-amber-50 mb-2.5"
                    >
                      <svg
                        className="text-amber-700 flex-none mt-0.5"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
                      </svg>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-7 py-4 border-t border-slate-200 flex items-center gap-2 flex-none">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700"
              >
                Save resume
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
              >
                Discard
              </button>
              <span className="text-xs text-slate-400 ml-auto">
                Click name to rename
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
