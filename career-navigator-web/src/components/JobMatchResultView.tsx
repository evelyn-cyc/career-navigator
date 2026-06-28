import { useCareerStore } from '../store/useCareerStore'
import MatchGauge from './MatchGauge'

function JobMatchResultView() {
  const jobMatchResult = useCareerStore((state) => state.jobMatchResult)

  if (!jobMatchResult) return null

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm mt-4">
      <h2 className="text-base font-bold text-slate-900 mb-4">Match Result</h2>

      <MatchGauge level={jobMatchResult.matchLevel} showLabels />

      <p className="text-sm font-semibold text-slate-500 mb-1 mt-5">
        Matched Skills
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {jobMatchResult.matchedSkills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-sm font-semibold rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm font-semibold text-slate-500 mb-1">
        Missing Skills
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {jobMatchResult.missingSkills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-sm font-semibold rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm font-semibold text-slate-500 mb-1">
        Suggested Keywords
      </p>
      <div className="flex flex-wrap gap-2">
        {jobMatchResult.suggestedKeywords.map((keyword) => (
          <span
            key={keyword}
            className="px-3 py-1 bg-violet-100 text-violet-700 border border-violet-200 text-sm font-semibold rounded-full"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  )
}

export default JobMatchResultView
