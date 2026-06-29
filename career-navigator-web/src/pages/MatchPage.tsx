import JobDescriptionInput from '../components/JobDescriptionInput'
import JobRequirementsView from '../components/JobRequirementsView'

function MatchPage() {
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
        <JobDescriptionInput />
        <JobRequirementsView />
      </div>
    </div>
  )
}

export default MatchPage
