import { useJobs } from '../hooks/useJobs'
import JobDescriptionInput from '../components/JobDescriptionInput'
import JobRequirementsView from '../components/JobRequirementsView'
import type { JobRequirements } from '../types'

function MatchPage() {
  const { addJob } = useJobs()

  const handleExtract = (requirements: JobRequirements) => {
    addJob({
      ...requirements,
      savedDate: new Date().toISOString().split('T')[0],
    })
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

      <div className="grid grid-cols-2 gap-4 items-start">
        <JobDescriptionInput onExtract={handleExtract} />
        <JobRequirementsView />
      </div>
    </div>
  )
}

export default MatchPage
