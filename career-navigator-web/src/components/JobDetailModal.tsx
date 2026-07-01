import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { JobPostingDetailsGrid } from './JobPostingDetailsGrid'
import { computeMatch } from '../utils/matching'
import { useCareerStore } from '../store/useCareerStore'
import type { Job, JobMatchRecord, ResumeAnalysis, MatchLevel } from '../types'

type Tab = 'overview' | 'match' | 'suggestions'

type JobDetailModalProps = {
  job: Job
  resumes: ResumeAnalysis[]
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Omit<Job, 'id'>>) => void
}

const LEVEL_TEXT: Record<MatchLevel, string> = {
  strong: 'text-violet-600',
  good: 'text-green-700',
  moderate: 'text-amber-600',
  weak: 'text-orange-500',
  mismatch: 'text-red-600',
}
const LEVEL_BAR: Record<MatchLevel, string> = {
  strong: 'bg-violet-600',
  good: 'bg-green-700',
  moderate: 'bg-amber-500',
  weak: 'bg-orange-500',
  mismatch: 'bg-red-600',
}
const LEVEL_SEGS: Record<MatchLevel, number> = {
  strong: 5,
  good: 4,
  moderate: 3,
  weak: 2,
  mismatch: 1,
}

function MiniGaugeBadge({ level }: { level: MatchLevel }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[11px] font-bold capitalize ${LEVEL_TEXT[level]}`}>
        {level}
      </span>
      <div className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-1 rounded-sm ${i <= LEVEL_SEGS[level] ? LEVEL_BAR[level] : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  )
}

function MatchRecordCard({ record }: { record: JobMatchRecord }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 mb-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-bold text-slate-900 min-w-0 line-clamp-1">
          {record.resumeName}
        </p>
        <div className="flex items-center gap-2 flex-none">
          <span className="text-[11px] text-slate-400">
            {record.matchedDate}
          </span>
          <MiniGaugeBadge level={record.matchLevel} />
        </div>
      </div>

      {record.matchedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {record.matchedSkills.map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {record.missingSkills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {record.missingSkills.map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200"
            >
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          Full coverage — no missing skills.
        </p>
      )}
    </div>
  )
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
  const [selectedResumeId, setSelectedResumeId] = useState('')

  const matches = job.matches ?? []
  const latestMatch = matches.at(-1)
  const existingRecord = matches.find((m) => m.resumeId === selectedResumeId)

  const handleRunMatch = () => {
    const resume = resumes.find((r) => r.id === selectedResumeId)
    if (!resume) return
    if (existingRecord) {
      const confirmed = window.confirm(
        `"${resume.name}" was already matched on ${existingRecord.matchedDate}. Re-run will replace the existing result — continue?`,
      )
      if (!confirmed) return
    }
    const result = computeMatch(job.requiredSkills, resume.extractedSkills)
    const newRecord: JobMatchRecord = {
      resumeId: resume.id,
      resumeName: resume.name,
      matchLevel: result.matchLevel,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      matchedDate: new Date().toISOString().split('T')[0],
    }
    const updatedMatches = matches.some((m) => m.resumeId === resume.id)
      ? matches.map((m) => (m.resumeId === resume.id ? newRecord : m))
      : [...matches, newRecord]
    onUpdate(job.id, { matches: updatedMatches })
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
                {t === 'match' && matches.length > 0 && (
                  <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600">
                    {matches.length}
                  </span>
                )}
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
                  <div className="mb-4">
                    <div className="flex gap-2">
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
                        {existingRecord ? 'Re-run' : 'Run Match'}
                      </button>
                    </div>
                  </div>

                  {matches.length === 0 ? (
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
                        No matches yet
                      </p>
                      <p className="text-sm text-slate-400">
                        Pick a resume above and run a match to compare.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                        Match Results ({matches.length})
                      </p>
                      {[...matches].reverse().map((record) => (
                        <MatchRecordCard
                          key={record.resumeId}
                          record={record}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* ── Suggestions ── */}
          {tab === 'suggestions' && (
            <>
              {!latestMatch ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Run a match on the Match tab to see suggestions here.
                </p>
              ) : latestMatch.missingSkills.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  This resume already covers every required skill for this role.
                </p>
              ) : (
                <>
                  <p className="text-xs text-slate-400 mb-4">
                    Based on:{' '}
                    <span className="font-semibold text-slate-600">
                      {latestMatch.resumeName}
                    </span>
                  </p>
                  {latestMatch.missingSkills.map((skill) => (
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
                        <strong className="text-slate-900">{skill}</strong>,
                        which isn't showing up on the attached resume — if a
                        recent project used it, consider adding a line about it.
                      </p>
                    </div>
                  ))}
                </>
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
