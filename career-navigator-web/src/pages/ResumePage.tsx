import { useState, useRef } from 'react'
import { Plus, Pin, FileText } from 'lucide-react'
import { useResumes } from '../hooks/useResumes'
import AddResumeModal from '../components/AddResumeModal'
import ResumeDetailModal from '../components/ResumeDetailModal'
import type { ResumeAnalysis } from '../types'

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

function ResumeCard({
  resume,
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
  resume: ResumeAnalysis
  onView: (resume: ResumeAnalysis) => void
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
      onClick={() => onView(resume)}
      onDragStart={() => onDragStart(resume.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(resume.id)
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(resume.id)
      }}
      className={`bg-white border border-slate-200 rounded-xl p-[18px] cursor-pointer relative transition shadow-sm group select-none ${
        resume.pinned ? 'border-t-[3px] border-t-violet-600' : ''
      } ${isDragging ? 'opacity-40 scale-95' : 'hover:shadow-md hover:border-slate-300'} ${
        isDragOver
          ? 'border-violet-400 shadow-violet-100 ring-2 ring-violet-100'
          : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-10 rounded-[6px] bg-violet-50 flex items-center justify-center flex-none">
          <FileText size={18} className="text-violet-600" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin(resume.id)
            }}
            title={resume.pinned ? 'Unpin' : 'Pin for matching'}
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-slate-100 transition-colors ${
              resume.pinned ? 'text-violet-600' : 'text-slate-400'
            }`}
          >
            <Pin size={13} fill={resume.pinned ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <p className="text-[13.5px] font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
        {resume.name}
      </p>
      <p className="text-[12px] text-slate-500 mb-3">
        Uploaded {resume.uploadedDate}
      </p>

      <div className="flex flex-wrap gap-1.5 pb-4">
        {resume.extractedSkills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-600"
          >
            {skill}
          </span>
        ))}
        {resume.extractedSkills.length > 3 && (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
            +{resume.extractedSkills.length - 3}
          </span>
        )}
      </div>

      <DragDots />
    </div>
  )
}

function ResumePage() {
  const {
    resumes,
    addResume,
    deleteResume,
    togglePin,
    reorderResumes,
    renameResume,
  } = useResumes()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewingResume, setViewingResume] = useState<ResumeAnalysis | null>(
    null,
  )
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const dragSrcRef = useRef<string | null>(null)

  const pinned = resumes.filter((r) => r.pinned)
  const unpinned = resumes.filter((r) => !r.pinned)

  const handleDelete = (id: string) => {
    deleteResume(id)
    setViewingResume(null)
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
    if (dragSrcRef.current && dragSrcRef.current !== id) {
      setDragOverId(id)
    }
  }

  const handleDrop = (targetId: string) => {
    if (dragSrcRef.current && dragSrcRef.current !== targetId) {
      reorderResumes(dragSrcRef.current, targetId)
    }
    setDraggingId(null)
    setDragOverId(null)
    dragSrcRef.current = null
  }

  const cardProps = (resume: ResumeAnalysis) => ({
    resume,
    onView: setViewingResume,
    onTogglePin: togglePin,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDragLeave: () => setDragOverId(null),
    onDrop: handleDrop,
    isDragging: draggingId === resume.id,
    isDragOver: dragOverId === resume.id,
  })

  return (
    <div>
      <header className="flex items-start justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Resume Analysis
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Resume Library</h1>
          <p className="text-slate-500 mt-2 max-w-md">
            Upload and manage multiple resumes — pin whichever one fits when
            matching against a job.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-[18px] py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 flex-none mt-1"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Resume
        </button>
      </header>

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
          pinned.map((resume) => (
            <ResumeCard key={resume.id} {...cardProps(resume)} />
          ))
        )}
      </div>

      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          All Resumes
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {unpinned.length}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 min-h-[20px]">
        {unpinned.length === 0 ? (
          <p className="text-sm text-slate-400 italic col-span-full">
            {resumes.length === 0
              ? 'No resumes yet — add one above.'
              : 'All resumes are pinned.'}
          </p>
        ) : (
          unpinned.map((resume) => (
            <ResumeCard key={resume.id} {...cardProps(resume)} />
          ))
        )}
      </div>

      {isAddOpen && (
        <AddResumeModal
          existingNames={resumes.map((r) => r.name)}
          onAdd={addResume}
          onClose={() => setIsAddOpen(false)}
        />
      )}

      {viewingResume && (
        <ResumeDetailModal
          resume={viewingResume}
          onClose={() => setViewingResume(null)}
          onDelete={handleDelete}
          onRename={renameResume}
        />
      )}
    </div>
  )
}

export default ResumePage
