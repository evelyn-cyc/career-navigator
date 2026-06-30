import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { JobPostingDetailsGrid } from './JobPostingDetailsGrid'
import MatchGauge from './MatchGauge'
import { computeMatch } from '../utils/matching'
import { useCareerStore } from '../store/useCareerStore'
import type { Job, ResumeAnalysis } from '../types'

type Tab = 'overview' | 'match' | 'suggestions'

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
  const [tab, setTab] = useState<Tab>('overview')
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
        <div className="px-7 pt-7 pb-0 border-b border-slate-200 flex-none">
          <div className="flex items-start justify-between gap-4 mb-1">
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
          <p className="text-xs text-slate-400 mb-4">Saved {job.savedDate}</p>

          <div className="flex">
            {(['overview', 'match', 'suggestions'] as Tab[]).map((t) => (
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

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          {/* ── Overview ── */}
          {tab === 'overview' && (
            <>
              <JobPostingDetailsGrid details={job} />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">
                    No skills recorded.
                  </p>
                ) : (
                  job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold bg-violet-50 text-violet-600"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </>
          )}

          {/* ── Match ── */}
          {tab === 'match' && (
            <>
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
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.pinned ? '📌 ' : ''}
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleRunMatch}
                      disabled={!selectedResumeId}
                      className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {job.attachedResumeId ? 'Re-run' : 'Attach & match'}
                    </button>
                  </div>

                  {job.matchLevel && job.matchedSkills && job.missingSkills ? (
                    <>
                      {matchedResumeName && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 text-sm font-semibold text-green-700">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Matched against {matchedResumeName}
                        </div>
                      )}
                      <MatchGauge level={job.matchLevel} showLabels />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 mt-5">
                        Matched Skills
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.matchedSkills.length === 0 ? (
                          <p className="text-sm text-slate-400 italic">
                            None matched.
                          </p>
                        ) : (
                          job.matchedSkills.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-sm font-semibold rounded-full"
                            >
                              {s}
                            </span>
                          ))
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        Missing Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.missingSkills.length === 0 ? (
                          <p className="text-sm text-slate-400 italic">
                            Nothing missing — full coverage.
                          </p>
                        ) : (
                          job.missingSkills.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-sm font-semibold rounded-full"
                            >
                              {s}
                            </span>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-1">
                        No resume attached yet
                      </p>
                      <p className="text-sm text-slate-400">
                        Pick a resume above to see how well it matches.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ── Suggestions ── */}
          {tab === 'suggestions' && (
            <>
              {!job.attachedResumeId ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Attach a resume on the Match tab to see suggestions here.
                </p>
              ) : !job.missingSkills || job.missingSkills.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  This resume already covers every required skill for this role.
                </p>
              ) : (
                job.missingSkills.map((skill) => (
                  <div
                    key={skill}
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
                      This role lists{' '}
                      <strong className="text-slate-900">{skill}</strong>, which
                      isn't showing up on the attached resume — if a recent
                      project used it, consider adding a line about it.
                    </p>
                  </div>
                ))
              )}
            </>
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
