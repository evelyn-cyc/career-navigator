import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import { useJobs } from '../hooks/useJobs'
import { useResumes } from '../hooks/useResumes'
import JobDescriptionInput from '../components/JobDescriptionInput'
import JobRequirementsView from '../components/JobRequirementsView'
import JobDetailModal from '../components/JobDetailModal'
import type { Job, JobRequirements } from '../types'

function JobCard({ job, onView }: { job: Job; onView: (job: Job) => void }) {
  return (
    <div
      onClick={() => onView(job)}
      className="bg-white border border-slate-200 rounded-xl p-[18px] cursor-pointer transition shadow-sm group hover:shadow-md hover:border-slate-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-10 rounded-[6px] bg-blue-50 flex items-center justify-center flex-none">
          <Briefcase size={16} className="text-blue-600" />
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

      <div className="flex flex-wrap gap-1.5">
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
    </div>
  )
}

function MatchPage() {
  const { jobs, addJob, updateJob, deleteJob } = useJobs()
  const { resumes } = useResumes()
  const [viewingJob, setViewingJob] = useState<Job | null>(null)

  const sortedResumes = [
    ...resumes.filter((r) => r.pinned),
    ...resumes.filter((r) => !r.pinned),
  ]

  const handleExtract = (requirements: JobRequirements) => {
    addJob({
      ...requirements,
      savedDate: new Date().toISOString().split('T')[0],
    })
  }

  const handleDelete = (id: string) => {
    deleteJob(id)
    setViewingJob(null)
  }

  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Job Analysis
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Job Analysis</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Paste a job description to extract its requirements — company, role,
          salary, and the skills it needs.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 items-start mb-10">
        <JobDescriptionInput onExtract={handleExtract} />
        <JobRequirementsView />
      </div>

      {jobs.length > 0 && (
        <>
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Saved Jobs
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {jobs.length}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onView={setViewingJob} />
            ))}
          </div>
        </>
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
