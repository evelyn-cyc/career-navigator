import type { Job, ApplicationStatus } from '../types'

const statusColors: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-100 text-blue-700 border-blue-200',
  Interviewing: 'bg-amber-100 text-amber-700 border-amber-200',
  Offer: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
}

type AttemptRow = {
  job: Job
  attemptId: string
  status: ApplicationStatus
  appliedDate: string
}

type ApplicationListProps = {
  jobs: Job[]
  onView: (job: Job) => void
}

function ApplicationList({ jobs, onView }: ApplicationListProps) {
  const rows: AttemptRow[] = jobs.flatMap((job) =>
    (job.applications ?? []).map((attempt) => ({
      job,
      attemptId: attempt.attemptId,
      status: attempt.status,
      appliedDate: attempt.appliedDate,
    })),
  )

  if (rows.length === 0) {
    return <p className="text-slate-500">No applications tracked yet.</p>
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
      {rows.map((row) => (
        <div
          key={row.attemptId}
          onClick={() => onView(row.job)}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-start cursor-pointer transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold">
              {row.job.role} @ {row.job.company}
            </p>
            <p className="text-slate-500 text-sm">{row.appliedDate}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full border text-sm font-semibold shrink-0 ml-3 ${statusColors[row.status]}`}
          >
            {row.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default ApplicationList