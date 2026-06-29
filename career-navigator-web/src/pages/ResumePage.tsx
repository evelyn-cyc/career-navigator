import { useState } from 'react'
import { useResumes } from '../hooks/useResumes'
import ResumeUpload from '../components/ResumeUpload'
import ResumeList from '../components/ResumeList'
import ResumeDetailModal from '../components/ResumeDetailModal'
import type { ResumeAnalysis } from '../types'

function ResumePage() {
  const { resumes, addResume, deleteResume } = useResumes()
  const [viewingResume, setViewingResume] = useState<ResumeAnalysis | null>(
    null,
  )

  const handleDelete = (id: string) => {
    deleteResume(id)
    setViewingResume(null)
  }

  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Resume Analysis
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Resume Analysis</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Upload and manage multiple resumes — pick whichever one fits when
          matching against a job.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 items-start">
        <ResumeUpload onAdd={addResume} />
        <ResumeList resumes={resumes} onView={setViewingResume} />
      </div>

      {viewingResume && (
        <ResumeDetailModal
          resume={viewingResume}
          onClose={() => setViewingResume(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default ResumePage
