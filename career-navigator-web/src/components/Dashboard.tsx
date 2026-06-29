import type { Application, ApplicationStatus } from '../types'

type DashboardProps = {
  applications: Application[]
}

const allStatuses: ApplicationStatus[] = [
  'Saved',
  'Applied',
  'OA',
  'Interview',
  'Offer',
  'Rejected',
]

function Dashboard({ applications }: DashboardProps) {
  const statusData = allStatuses.map((status) => ({
    status,
    count: applications.filter((app) => app.status === status).length,
  }))

  const maxCount = Math.max(...statusData.map((d) => d.count), 1)

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Applications by status
        </h2>
        <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold rounded-full">
          Tracker summary
        </span>
      </div>

      <div className="space-y-3">
        {statusData.map(({ status, count }) => (
          <div
            key={status}
            className="grid grid-cols-[90px_1fr_28px] items-center gap-3"
          >
            <span className="text-sm text-slate-500">{status}</span>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-600"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-900 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
