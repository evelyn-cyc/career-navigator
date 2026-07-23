import { useState, useRef } from 'react'
import { Plus, Briefcase, Pin } from 'lucide-react'
import { useJobs } from '../hooks/useJobs'
import { useResumes } from '../hooks/useResumes'
import AddJobModal from '../components/AddJobModal'
import JobDetailModal from '../components/JobDetailModal'
import type { Job, MatchLevel } from '../types'

// ── Match mini gauge ──────────────────────────────────────────────────
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

// ── Drag handle dots ──────────────────────────────────────────────────
function DragDots() {
  return (
    <svg
      className="absolute bottom-2.5 right-2.5 text-slate-300"
      width="12"
      height="16"
      viewBox="0 0 12 16"
    >
      <circle cx="3" cy="2.5" r="1.3" fill="currentColor" />
      <circle cx="3" cy="8" r="1.3" fill="currentColor" />
      <circle cx="3" cy="13.5" r="1.3" fill="currentColor" />
      <circle cx="9" cy="2.5" r="1.3" fill="currentColor" />
      <circle cx="9" cy="8" r="1.3" fill="currentColor" />
      <circle cx="9" cy="13.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

// ── Job card ──────────────────────────────────────────────────────────
function JobCard({
  job,
  onView,
  onTogglePin,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  isDragOver,
}: {
  job: Job
  onView: (job: Job) => void
  onTogglePin: (id: string) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onDragOver: (id: string) => void
  onDragLeave: () => void
  onDrop: (id: string) => void
  isDragging: boolean
  isDragOver: boolean
}) {
  return (
    <div
      draggable
      onClick={() => onView(job)}
      onDragStart={() => onDragStart(job.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(job.id)
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(job.id)
      }}
      className={`bg-white border border-slate-200 rounded-xl p-[18px] cursor-pointer relative transition shadow-sm group select-none flex flex-col ${
        job.pinned ? 'border-t-[3px] border-t-violet-600' : ''
      } ${isDragging ? 'opacity-40 scale-95' : 'hover:shadow-md hover:border-slate-300'} ${
        isDragOver ? 'border-violet-400 ring-2 ring-violet-100' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-[6px] bg-violet-50 flex items-center justify-center flex-none">
          <Briefcase size={16} className="text-violet-600" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin(job.id)
            }}
            title={job.pinned ? 'Unpin' : 'Pin'}
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-slate-100 transition-colors ${
              job.pinned ? 'text-violet-600' : 'text-slate-400'
            }`}
          >
            <Pin size={13} fill={job.pinned ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <p className="text-[13.5px] font-bold text-slate-900 leading-snug line-clamp-1 mb-0.5">
        {job.role ?? 'Unknown Role'}
      </p>
      <p className="text-[12px] text-slate-500 mb-2">
        {job.company ?? 'Unknown Company'}
      </p>
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
        {job.matches && job.matches.length > 0 ? (
          <div className="flex items-center gap-2">
            <MiniGauge level={job.matches.at(-1)!.matchLevel} />
            {job.matches.length > 1 && (
              <span className="text-[10px] text-slate-400">
                +{job.matches.length - 1} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">
            No resume matched
          </span>
        )}
      </div>

      <DragDots />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────
function MatchPage() {
  const {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    togglePin,
    reorderJobs,
    addAttempt,
    updateAttempt,
    deleteAttempt,
  } = useJobs()  
  const { resumes } = useResumes()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewingJobId, setViewingJobId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const dragSrcRef = useRef<string | null>(null)
  
  const viewingJob = jobs.find((j) => j.id === viewingJobId) ?? null
  
  const pinned = jobs.filter((j) => j.pinned)
  const unpinned = jobs.filter((j) => !j.pinned)

  const sortedResumes = [
    ...resumes.filter((r) => r.pinned),
    ...resumes.filter((r) => !r.pinned),
  ]

  const handleJobAdded = (data: Omit<Job, 'id'>, openDetail: boolean) => {
    const id = crypto.randomUUID()
    addJob(data, id)
    setIsAddOpen(false)
    if (openDetail) setViewingJobId(id)
  }

  const handleDelete = (id: string) => {
    deleteJob(id)
    setViewingJobId(null)
  }

  const handleDragStart = (id: string) => {
    dragSrcRef.current = id
    setTimeout(() => setDraggingId(id), 0)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverId(null)
    dragSrcRef.current = null
  }

  const handleDragOver = (id: string) => {
    if (dragSrcRef.current && dragSrcRef.current !== id) setDragOverId(id)
  }

  const handleDrop = (targetId: string) => {
    if (dragSrcRef.current && dragSrcRef.current !== targetId) {
      reorderJobs(dragSrcRef.current, targetId)
    }
    setDraggingId(null)
    setDragOverId(null)
    dragSrcRef.current = null
  }

  const cardProps = (job: Job) => ({
    job,
    onView: (job: Job) => setViewingJobId(job.id),
    onTogglePin: togglePin,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDragLeave: () => setDragOverId(null),
    onDrop: handleDrop,
    isDragging: draggingId === job.id,
    isDragOver: dragOverId === job.id,
  })

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

      {/* Pinned section */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          📌 Pinned
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {pinned.length}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 mb-9 min-h-[20px]">
        {pinned.length === 0 ? (
          <p className="text-sm text-slate-400 italic col-span-full">
            Nothing pinned yet — hover a card to pin it.
          </p>
        ) : (
          pinned.map((job) => <JobCard key={job.id} {...cardProps(job)} />)
        )}
      </div>

      {/* All Jobs section */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          All Jobs
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {unpinned.length}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 min-h-[20px]">
        {unpinned.length === 0 ? (
          <p className="text-sm text-slate-400 italic col-span-full">
            {jobs.length === 0
              ? 'No jobs saved yet — click Add Job to get started.'
              : 'All jobs are pinned.'}
          </p>
        ) : (
          unpinned.map((job) => <JobCard key={job.id} {...cardProps(job)} />)
        )}
      </div>

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
          onClose={() => setViewingJobId(null)}
          onDelete={handleDelete}
          onUpdate={updateJob}
          onAddAttempt={addAttempt}
          onUpdateAttempt={updateAttempt}
          onDeleteAttempt={deleteAttempt}
        />
      )}
    </div>
  )
}

export default MatchPage
