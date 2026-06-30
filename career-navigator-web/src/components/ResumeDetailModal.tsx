import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getFile } from '../utils/fileStore'
import type { ResumeAnalysis } from '../types'
import type { StoredFile } from '../utils/fileStore'

type Tab = 'overview' | 'skills' | 'projects' | 'suggestions'

type ResumeDetailModalProps = {
  resume: ResumeAnalysis
  onClose: () => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}

function ResumeDetailModal({
  resume,
  onClose,
  onDelete,
  onRename,
}: ResumeDetailModalProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const [name, setName] = useState(resume.name)
  const [storedFile, setStoredFile] = useState<StoredFile | null>(null)

  useEffect(() => {
    getFile(resume.id)
      .then(setStoredFile)
      .catch(() => null)
  }, [resume.id])

  const handlePreview = () => {
    if (!storedFile) return
    const url = URL.createObjectURL(storedFile.blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  const handleDownload = () => {
    if (!storedFile) return
    const url = URL.createObjectURL(storedFile.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = storedFile.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${resume.name}"? This can't be undone.`,
    )
    if (confirmed) onDelete(resume.id)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-8 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] h-[82vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-0 border-b border-slate-200 flex-none">
          <div className="flex items-start justify-between gap-4 mb-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                const trimmed = name.trim()
                if (trimmed && trimmed !== resume.name) {
                  onRename(resume.id, trimmed)
                } else {
                  setName(resume.name)
                }
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
          <p className="text-sm text-slate-500 mb-4">
            Uploaded {resume.uploadedDate} · {resume.extractedSkills.length}{' '}
            skills detected
          </p>

          <div className="flex">
            {(['overview', 'skills', 'projects', 'suggestions'] as Tab[]).map(
              (t) => (
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
              ),
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          {tab === 'overview' && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Summary
              </p>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                {resume.overview ?? 'No summary available for this resume.'}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Top skills
              </p>
              <div className="flex flex-wrap gap-2">
                {resume.extractedSkills.slice(0, 6).map((skill) => (
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
                {resume.extractedSkills.map((skill) => (
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
              {resume.projects.map((project, i) => (
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
              {resume.suggestions.map((s, i) => (
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
                  <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-200 flex items-center gap-2 flex-none">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
          >
            Close
          </button>
          {storedFile && (
            <>
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
              >
                Preview
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
              >
                Download
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-white border border-red-200 text-sm text-red-600 font-semibold rounded-xl hover:bg-red-50 ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeDetailModal
