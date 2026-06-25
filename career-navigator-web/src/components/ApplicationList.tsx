import type { Application, ApplicationStatus } from '../types'

const statusColors: Record<ApplicationStatus, string> = {
  Saved: 'bg-slate-600',
  Applied: 'bg-blue-600',
  OA: 'bg-purple-600',
  Interview: 'bg-yellow-600',
  Offer: 'bg-green-600',
  Rejected: 'bg-red-600',
}

type ApplicationListProps = {
  applications: Application[]
  onUpdateStatus: (id: string, status: ApplicationStatus) => void
  onDelete: (id: string) => void
}

function ApplicationList({
  applications,
  onUpdateStatus,
  onDelete,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return <p className="text-slate-400 mt-4">No applications tracked yet.</p>
  }

  return (
    <div className="mt-4 space-y-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4 bg-slate-800 rounded-lg flex justify-between items-start"
        >
          <div>
            <p className="text-white font-bold">
              {app.role} @ {app.company}
            </p>
            <p className="text-slate-400 text-sm">{app.appliedDate}</p>
            {app.matchLevel && (
              <p className="text-slate-400 text-sm">Match: {app.matchLevel}</p>
            )}
            {app.notes && (
              <p className="text-slate-300 text-sm mt-1">{app.notes}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <select
              value={app.status}
              onChange={(e) =>
                onUpdateStatus(app.id, e.target.value as ApplicationStatus)
              }
              className={`px-2 py-1 rounded text-white text-sm ${statusColors[app.status]}`}
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="OA">OA</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={() => onDelete(app.id)}
              className="text-red-400 text-sm hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ApplicationList
