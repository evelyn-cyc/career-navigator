import JobDescriptionInput from '../components/JobDescriptionInput'
import JobMatchResultView from '../components/JobMatchResultView'

function MatchPage() {
  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Job Matcher
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Job Matcher</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Paste a job description to see exactly which skills match, which are
          missing, and what to learn next.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 items-start">
        <JobDescriptionInput />
        <JobMatchResultView />
      </div>
    </div>
  )
}

export default MatchPage
