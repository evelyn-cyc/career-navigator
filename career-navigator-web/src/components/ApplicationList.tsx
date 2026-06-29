import type { Application, ApplicationStatus } from '../types'

const statusColors: Record<ApplicationStatus, string> = {
  Saved: 'bg-slate-100 text-slate-700 border-slate-200',
  Applied: 'bg-blue-100 text-blue-700 border-blue-200',
  OA: 'bg-violet-100 text-violet-700 border-violet-200',
  Interview: 'bg-amber-100 text-amber-700 border-amber-200',
  Offer: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
}

type ApplicationListProps = {
  applications: Application[]
  onUpdateStatus: (id: string, status: ApplicationStatus) => void
  onView: (application: Application) => void
}

function ApplicationList({
  applications,
  onUpdateStatus,
  onView,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return <p className="text-slate-500">No applications tracked yet.</p>
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-start"
        >
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold">
              {app.role} @ {app.company}
            </p>
            <p className="text-slate-500 text-sm">{app.appliedDate}</p>
            {app.matchLevel && (
              <p className="text-slate-500 text-sm">Match: {app.matchLevel}</p>
            )}
            {app.notes && (
              <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                {app.notes}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0 ml-3">
            <select
              value={app.status}
              onChange={(e) =>
                onUpdateStatus(app.id, e.target.value as ApplicationStatus)
              }
              className={`px-2 py-1 rounded-full border text-sm font-semibold ${statusColors[app.status]}`}
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="OA">OA</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={() => onView(app)}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700"
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ApplicationList
