import { X } from 'lucide-react'
import type { ResumeAnalysis } from '../types'

type ResumeDetailModalProps = {
  resume: ResumeAnalysis
  onClose: () => void
  onDelete: (id: string) => void
}

function ResumeDetailModal({
  resume,
  onClose,
  onDelete,
}: ResumeDetailModalProps) {
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${resume.name}"? This can't be undone.`,
    )
    if (confirmed) onDelete(resume.id)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-start mb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{resume.name}</h2>
            <p className="text-sm text-slate-500">
              Uploaded {resume.uploadedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto">
          <p className="text-sm font-semibold text-slate-500 mb-1">Skills</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {resume.extractedSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          <p className="text-sm font-semibold text-slate-500 mb-1">Projects</p>
          <ul className="text-slate-700 list-disc list-inside mb-4">
            {resume.projects.map((project) => (
              <li key={project}>{project}</li>
            ))}
          </ul>

          <p className="text-sm font-semibold text-slate-500 mb-1">
            Suggestions
          </p>
          <ul className="text-slate-700 list-disc list-inside">
            {resume.suggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 mt-5 shrink-0">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeDetailModal
