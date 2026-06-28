import { useCareerStore } from '../store/useCareerStore'

function ResumeAnalysisView() {
  const resumeAnalysis = useCareerStore((state) => state.resumeAnalysis)

  if (!resumeAnalysis) return null

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm mt-4">
      <h2 className="text-base font-bold text-slate-900 mb-3">
        Resume Analysis
      </h2>

      <p className="text-sm font-semibold text-slate-500 mb-1">Skills</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {resumeAnalysis.extractedSkills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm font-semibold text-slate-500 mb-1">Projects</p>
      <ul className="text-slate-700 list-disc list-inside mb-4">
        {resumeAnalysis.projects.map((project) => (
          <li key={project}>{project}</li>
        ))}
      </ul>

      <p className="text-sm font-semibold text-slate-500 mb-1">Suggestions</p>
      <ul className="text-slate-700 list-disc list-inside">
        {resumeAnalysis.suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  )
}

export default ResumeAnalysisView
