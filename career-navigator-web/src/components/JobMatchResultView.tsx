import { useCareerStore } from '../store/useCareerStore'
import type { MatchLevel } from '../types'

const matchLevelColors: Record<MatchLevel, string> = {
  strong: 'bg-green-600',
  good: 'bg-blue-600',
  moderate: 'bg-yellow-600',
  weak: 'bg-orange-600',
  mismatch: 'bg-red-600',
}

function JobMatchResultView() {
  const jobMatchResult = useCareerStore((state) => state.jobMatchResult)

  if (!jobMatchResult) return null

  return (
    <div className="p-6 bg-slate-800 rounded-lg mt-4">
      <h2 className="text-xl font-bold text-white mb-3">Match Result</h2>

      <span
        className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold uppercase mb-4 ${matchLevelColors[jobMatchResult.matchLevel]}`}
      >
        {jobMatchResult.matchLevel}
      </span>

      <p className="text-slate-400 mb-1">Matched Skills</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {jobMatchResult.matchedSkills.map((skill) => (
          <span key={skill} className="px-3 py-1 bg-green-700 text-white text-sm rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <p className="text-slate-400 mb-1">Missing Skills</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {jobMatchResult.missingSkills.map((skill) => (
          <span key={skill} className="px-3 py-1 bg-red-700 text-white text-sm rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <p className="text-slate-400 mb-1">Suggested Keywords</p>
      <ul className="text-white list-disc list-inside">
        {jobMatchResult.suggestedKeywords.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
    </div>
  )
}

export default JobMatchResultView
