import { useNavigate } from 'react-router-dom'
import { useCareerStore } from '../store/useCareerStore'
import type { JobPostingDetails } from '../types'

function JobPostingDetailsGrid({ details }: { details: JobPostingDetails }) {
  const fields: { label: string; value?: string; href?: string }[] = [
    { label: 'Company', value: details.company },
    { label: 'Role', value: details.role },
    { label: 'Type', value: details.employmentType },
    { label: 'Location', value: details.location },
    { label: 'Work Arrangement', value: details.workArrangement },
    { label: 'Salary', value: details.salaryRange },
    { label: 'Start Date', value: details.startDate },
    { label: 'End Date', value: details.endDate },
    { label: 'Working Hours', value: details.workingHours },
    { label: 'Citizenship / Visa', value: details.citizenshipRequirement },
    {
      label: 'Contact Email',
      value: details.contactEmail,
      href: details.contactEmail ? `mailto:${details.contactEmail}` : undefined,
    },
    {
      label: 'Application Link',
      value: details.applicationUrl,
      href: details.applicationUrl,
    },
  ].filter((field) => field.value)

  if (fields.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
      {fields.map((field) => (
        <div key={field.label}>
          <p className="font-semibold text-slate-500">{field.label}</p>
          {field.href ? (
            <a
              href={field.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {field.value}
            </a>
          ) : (
            <p className="text-slate-900">{field.value}</p>
          )}
        </div>
      ))}
    </div>
  )
}

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
