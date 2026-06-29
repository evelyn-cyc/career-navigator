import { useState } from 'react'
import { useCareerStore } from '../store/useCareerStore'
import type { Application, ApplicationStatus } from '../types'

type ApplicationFormProps = {
  onAdd: (data: Omit<Application, 'id'>) => void
}

function ApplicationForm({ onAdd }: ApplicationFormProps) {
  const jobRequirements = useCareerStore((state) => state.jobRequirements)
  const [company, setCompany] = useState(jobRequirements?.company ?? '')
  const [role, setRole] = useState(jobRequirements?.role ?? '')
  const [status, setStatus] = useState<ApplicationStatus>('Saved')
  const [contactEmail, setContactEmail] = useState(
    jobRequirements?.contactEmail ?? '',
  )
  const [applicationUrl, setApplicationUrl] = useState(
    jobRequirements?.applicationUrl ?? '',
  )
  const [requiredSkills, setRequiredSkills] = useState(
    jobRequirements?.requiredSkills.join(', ') ?? '',
  )
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    const skillsList = requiredSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)

    onAdd({
      company,
      role,
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      requiredSkills: skillsList.length > 0 ? skillsList : undefined,
      contactEmail: contactEmail.trim() || undefined,
      applicationUrl: applicationUrl.trim() || undefined,
      notes,
    })

    setCompany('')
    setRole('')
    setStatus('Saved')
    setContactEmail('')
    setApplicationUrl('')
    setRequiredSkills('')
    setNotes('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm"
    >
      <h2 className="text-base font-bold text-slate-900 mb-3">
        Track an application
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
          />
        </div>
      </div>
      <label className="block text-sm font-semibold text-slate-500 mb-1">
        Status
      </label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 mb-3"
      >
        <option value="Saved">Saved</option>
        <option value="Applied">Applied</option>
        <option value="OA">OA</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">
            Contact Email
          </label>
          <input
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="careers@company.com"
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">
            Application Link
          </label>
          <input
            value={applicationUrl}
            onChange={(e) => setApplicationUrl(e.target.value)}
            placeholder="https://..."
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
          />
        </div>
      </div>
      <label className="block text-sm font-semibold text-slate-500 mb-1">
        Required Skills
      </label>
      <input
        value={requiredSkills}
        onChange={(e) => setRequiredSkills(e.target.value)}
        placeholder="React, TypeScript, AWS (comma-separated)"
        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 mb-1"
      />
      <p className="text-xs text-slate-500 mb-3">
        Lets you match this application against a saved resume later.
      </p>
      <label className="block text-sm font-semibold text-slate-500 mb-1">
        Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
        rows={2}
        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 mb-3"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Add Application
      </button>
    </form>
  )
}

export default ApplicationForm
