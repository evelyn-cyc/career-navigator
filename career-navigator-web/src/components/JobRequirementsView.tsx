import { useNavigate } from 'react-router-dom'
import { useCareerStore } from '../store/useCareerStore'
import { JobPostingDetailsGrid } from './JobPostingDetailsGrid'

function JobRequirementsView() {
  const jobRequirements = useCareerStore((state) => state.jobRequirements)
  const navigate = useNavigate()

  if (!jobRequirements) return null

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-4">
        Extracted Requirements
      </h2>

      <JobPostingDetailsGrid details={jobRequirements} />

      <p className="text-sm font-semibold text-slate-500 mb-1">
        Required Skills
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {jobRequirements.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-violet-100 text-violet-700 border border-violet-200 text-sm font-semibold rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={() => navigate('/applications')}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Save as Application
      </button>
    </div>
  )
}

export default JobRequirementsView
