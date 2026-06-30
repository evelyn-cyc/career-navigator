import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { JobPostingDetailsGrid } from './JobPostingDetailsGrid'
import MatchGauge from './MatchGauge'
import { computeMatch } from '../utils/matching'
import { useCareerStore } from '../store/useCareerStore'
import type { Job, ResumeAnalysis } from '../types'

type JobDetailModalProps = {
  job: Job
  resumes: ResumeAnalysis[]
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Omit<Job, 'id'>>) => void
}

function JobDetailModal({
  job,
  resumes,
  onClose,
  onDelete,
  onUpdate,
}: JobDetailModalProps) {
  const navigate = useNavigate()
  const setJobRequirements = useCareerStore((state) => state.setJobRequirements)
  const [selectedResumeId, setSelectedResumeId] = useState(
    job.attachedResumeId ?? '',
  )

  const matchedResumeName = resumes.find(
    (r) => r.id === job.attachedResumeId,
  )?.name

  const handleRunMatch = () => {
    const resume = resumes.find((r) => r.id === selectedResumeId)
    if (!resume) return

    const result = computeMatch(job.requiredSkills, resume.extractedSkills)
    onUpdate(job.id, {
      ...result,
      attachedResumeId: resume.id,
      matchedDate: new Date().toISOString().split('T')[0],
    })
  }

  const handleTrackJob = () => {
    // Pre-fill the Application form by writing this job's data into the
    // shared Zustand store — ApplicationForm reads from it on mount.
    setJobRequirements(job)
    onClose()
    navigate('/applications')
  }

  const handleDelete = () => {
    const title = [job.role, job.company].filter(Boolean).join(' @ ') || 'Job'
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
          <div className="flex flex-wrap gap-2 mb-6">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-600"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Match section */}
          <div className="pt-5 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Match against a resume
            </p>
            {resumes.length === 0 ? (
              <p className="text-sm text-slate-500">
                Upload a resume on the Resume Analysis page first.
              </p>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="flex-1 min-w-0 p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 truncate"
                  >
                    <option value="">Choose a resume...</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.pinned ? '📌 ' : ''}
                        {resume.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRunMatch}
                    disabled={!selectedResumeId}
                    className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Run Match
                  </button>
                </div>

                {job.matchLevel && job.matchedSkills && job.missingSkills && (
                  <div>
                    <MatchGauge level={job.matchLevel} showLabels />
                    {matchedResumeName && (
                      <p className="text-sm text-slate-500 mt-3 mb-4">
                        Matched against: {matchedResumeName}
                      </p>
                    )}
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 mt-4">
                      Matched Skills
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-sm font-semibold rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Missing Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-sm font-semibold rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-200 flex items-center gap-2 flex-none">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={handleTrackJob}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
          >
            Track as Application
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
