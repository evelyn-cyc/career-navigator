import { useState } from 'react'
import { useJobs } from '../hooks/useJobs'
import { useResumes } from '../hooks/useResumes'
import ApplicationList from '../components/ApplicationList'
import JobDetailModal from '../components/JobDetailModal'

function ApplicationsPage() {
  const { jobs, updateJob, deleteJob, addAttempt, updateAttempt, deleteAttempt } =
    useJobs()
  const { resumes } = useResumes()
  const [viewingJobId, setViewingJobId] = useState<string | null>(null)

  const trackedJobs = jobs.filter(
    (job) => (job.applications ?? []).length > 0,
  )
  const viewingJob = jobs.find((j) => j.id === viewingJobId) ?? null

  const sortedResumes = [
    ...resumes.filter((r) => r.pinned),
    ...resumes.filter((r) => !r.pinned),
  ]

  const handleDelete = (id: string) => {
    deleteJob(id)
    setViewingJobId(null)
  }

  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Applications
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Every job you've applied to. Click one to change its stage or add
          notes — to track a new job, head to the Job Library.
        </p>
      </header>

      <ApplicationList
        jobs={trackedJobs}
        onView={(job) => setViewingJobId(job.id)}
      />

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

export default ApplicationsPage
