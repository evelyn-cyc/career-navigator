import { useState } from 'react'
import { useCareerStore } from '../store/useCareerStore'
import type { Application, ApplicationStatus } from '../types'

type ApplicationFormProps = {
  onAdd: (data: Omit<Application, 'id'>) => void
}

function ApplicationForm({ onAdd }: ApplicationFormProps) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('Saved')
  const [notes, setNotes] = useState('')
  const jobMatchResult = useCareerStore((state) => state.jobMatchResult)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    onAdd({
      company,
      role,
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      matchLevel: jobMatchResult?.matchLevel,
      notes,
    })

    setCompany('')
    setRole('')
    setStatus('Saved')
    setNotes('')
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-lg mt-4">
      <h2 className="text-xl font-bold text-white mb-3">
        3. Track an application
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-slate-400 text-sm mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
        </div>
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
        className="w-full p-2 rounded bg-slate-700 text-white mb-3"
      >
        <option value="Saved">Saved</option>
        <option value="Applied">Applied</option>
        <option value="OA">OA</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full p-2 rounded bg-slate-700 text-white mb-3"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Application
      </button>
    </form>
  )
}

export default ApplicationForm
