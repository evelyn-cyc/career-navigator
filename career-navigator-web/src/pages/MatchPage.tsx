import { useState } from 'react'
import { Plus, Briefcase } from 'lucide-react'
import { useJobs } from '../hooks/useJobs'
import { useResumes } from '../hooks/useResumes'
import AddJobModal from '../components/AddJobModal'
import JobDetailModal from '../components/JobDetailModal'
import type { Job, MatchLevel } from '../types'

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

function MiniGauge({ level }: { level: MatchLevel }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[11px] font-bold capitalize ${LEVEL_TEXT[level]}`}>
        {level}
      </span>
      <div className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-1 rounded-sm ${i <= LEVEL_SEGS[level] ? LEVEL_BAR[level] : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job, onView }: { job: Job; onView: (job: Job) => void }) {
  return (
    <div
      onClick={() => onView(job)}
      className="bg-white border border-slate-200 rounded-xl p-[18px] cursor-pointer transition shadow-sm hover:shadow-md hover:border-slate-300 flex flex-col"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-[6px] bg-violet-50 flex items-center justify-center flex-none">
          <Briefcase size={16} className="text-violet-600" />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold text-slate-900 leading-snug line-clamp-1">
            {job.role ?? 'Unknown Role'}
          </p>
          <p className="text-[12px] text-slate-500">
            {job.company ?? 'Unknown Company'}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mb-2">Saved {job.savedDate}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.requiredSkills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-600"
          >
            {skill}
          </span>
        ))}
        {job.requiredSkills.length > 3 && (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
            +{job.requiredSkills.length - 3}
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100">
        {job.matchLevel ? (
          <MiniGauge level={job.matchLevel} />
        ) : (
          <span className="text-[11px] text-slate-400 italic">
            No resume attached
          </span>
        )}
      </div>
    </div>
  )
}

function MatchPage() {
  const { jobs, addJob, updateJob, deleteJob } = useJobs()
  const { resumes } = useResumes()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewingJob, setViewingJob] = useState<Job | null>(null)

  const sortedResumes = [
    ...resumes.filter((r) => r.pinned),
    ...resumes.filter((r) => !r.pinned),
  ]

  const handleJobAdded = (data: Omit<Job, 'id'>, openDetail: boolean) => {
    const id = crypto.randomUUID()
    addJob(data, id)
    setIsAddOpen(false)
    if (openDetail) {
      setViewingJob({ ...data, id })
    }
  }

  const handleDelete = (id: string) => {
    deleteJob(id)
    setViewingJob(null)
  }

  return (
    <div>
      <header className="flex items-start justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Job Analysis
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Job Library</h1>
          <p className="text-slate-500 mt-2 max-w-md">
            Save jobs you're interested in, attach a resume to see how well it
            matches, and act on the gaps before you apply.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-[18px] py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 flex-none mt-1"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Job
        </button>
      </header>

      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Saved Jobs
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {jobs.length}
        </span>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-slate-400 italic">
          No jobs saved yet — click Add Job to get started.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onView={setViewingJob} />
          ))}
        </div>
      )}

      {isAddOpen && (
        <AddJobModal
          onAdd={handleJobAdded}
          onClose={() => setIsAddOpen(false)}
        />
      )}

      {viewingJob && (
        <JobDetailModal
          job={viewingJob}
          resumes={sortedResumes}
          onClose={() => setViewingJob(null)}
          onDelete={handleDelete}
          onUpdate={(id, data) => {
            updateJob(id, data)
            setViewingJob((prev) => (prev ? { ...prev, ...data } : prev))
          }}
        />
      )}
    </div>
  )
}

export default MatchPage
