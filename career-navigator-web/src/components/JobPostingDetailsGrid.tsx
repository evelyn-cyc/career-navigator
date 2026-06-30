import type { JobPostingDetails } from '../types'

export function JobPostingDetailsGrid({
  details,
}: {
  details: JobPostingDetails
}) {
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
