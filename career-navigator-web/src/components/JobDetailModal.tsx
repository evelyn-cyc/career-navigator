import { X } from 'lucide-react'
import { JobPostingDetailsGrid } from './JobPostingDetailsGrid'
import type { Job } from '../types'

type JobDetailModalProps = {
  job: Job
  onClose: () => void
  onDelete: (id: string) => void
}

function JobDetailModal({ job, onClose, onDelete }: JobDetailModalProps) {
  const title = [job.role, job.company].filter(Boolean).join(' @ ') || 'Job'

  const handleDelete = () => {
    if (window.confirm(`Delete "${title}"? This can't be undone.`)) {
      onDelete(job.id)
    }
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
        <div className="px-7 pt-7 pb-5 border-b border-slate-200 flex-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {job.role ?? 'Unknown Role'}
              </h2>
              {job.company && (
                <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center flex-none"
            >
              <X size={15} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Saved {job.savedDate}</p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          <JobPostingDetailsGrid details={job} />

          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-200 flex items-center flex-none">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
          >
            Close
          </button>
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

export default JobDetailModal
