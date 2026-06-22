import { useCareerStore } from '../store/useCareerStore'

function ResumeAnalysisView() {
  const resumeAnalysis = useCareerStore((state) => state.resumeAnalysis)

  if (!resumeAnalysis) return null

  return (
    <div className="p-6 bg-slate-800 rounded-lg mt-4">
      <h2 className="text-xl font-bold text-white mb-3">Resume Analysis</h2>

      <p className="text-slate-400 mb-1">Skills</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {resumeAnalysis.extractedSkills.map((skill) => (
          <span key={skill} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <p className="text-slate-400 mb-1">Projects</p>
      <ul className="text-white list-disc list-inside mb-4">
        {resumeAnalysis.projects.map((project) => (
          <li key={project}>{project}</li>
        ))}
      </ul>

      <p className="text-slate-400 mb-1">Suggestions</p>
      <ul className="text-white list-disc list-inside">
        {resumeAnalysis.suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  )
}

export default ResumeAnalysisView