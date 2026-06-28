import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
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

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-full">
      <h2 className="text-base font-bold text-slate-900 mb-3">
        Applications by status
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="status" stroke="#64748b" />
            <YAxis stroke="#64748b" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
              labelStyle={{ color: '#0f172a' }}
            />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard
