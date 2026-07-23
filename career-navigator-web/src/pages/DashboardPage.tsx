import { useJobs } from '../hooks/useJobs'
import Dashboard from '../components/Dashboard'
import MatchGauge from '../components/MatchGauge'

function DashboardPage() {
  const { jobs } = useJobs()

  const attempts = jobs.flatMap((job) => job.applications ?? [])
  const interviewingCount = attempts.filter(
    (attempt) => attempt.status === 'Interviewing',
  ).length

  const allMatches = jobs.flatMap((job) => job.matches ?? [])
  const latestMatch = allMatches
    .slice()
    .sort((a, b) => b.matchedDate.localeCompare(a.matchedDate))[0]

  const topSkillGap = latestMatch?.missingSkills[0] ?? '—'

  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Track your applications, resume strength, and most recent job match —
          all in one place.
        </p>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Total applications
          </p>
          <p className="text-2xl font-extrabold text-slate-900">
            {attempts.length}
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Interviewing
          </p>
          <p className="text-2xl font-extrabold text-slate-900">
            {interviewingCount}
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Latest match
          </p>
          {latestMatch ? (
            <>
              <p className="text-2xl font-extrabold text-slate-900 capitalize mb-2">
                {latestMatch.matchLevel}
              </p>
              <MatchGauge level={latestMatch.matchLevel} mini />
            </>
          ) : (
            <p className="text-2xl font-extrabold text-slate-900">—</p>
          )}
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Top skill gap
          </p>
          <p className="text-2xl font-extrabold text-slate-900">
            {topSkillGap}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        <Dashboard attempts={attempts} />

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Latest skill gap
          </h2>
          {latestMatch ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {latestMatch.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-sm font-semibold rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {latestMatch.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-sm font-semibold rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-500">
              Run a match on a job in the Job Library to see your skill gap
              here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
