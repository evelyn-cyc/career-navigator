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
import { useCareerStore } from '../store/useCareerStore'

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

  const jobMatchResult = useCareerStore((state) => state.jobMatchResult)

  const skillGapData = jobMatchResult
    ? [
        { name: 'Matched', count: jobMatchResult.matchedSkills.length },
        { name: 'Missing', count: jobMatchResult.missingSkills.length },
      ]
    : null

  return (
    <div className="p-6 bg-slate-800 rounded-lg mt-4">
      <h2 className="text-xl font-bold text-white mb-3">4. Dashboard</h2>

      <p className="text-slate-400 mb-2">Applications by status</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="status" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {skillGapData && (
        <>
          <p className="text-slate-400 mb-2 mt-6">Skill gap (latest match)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
