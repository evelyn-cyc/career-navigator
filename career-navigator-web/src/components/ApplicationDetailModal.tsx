import { useState } from 'react'
import { X } from 'lucide-react'
import type { Application, ApplicationStatus } from '../types'

type ApplicationDetailModalProps = {
  application: Application
  onClose: () => void
  onUpdate: (id: string, data: Omit<Application, 'id'>) => void
  onDelete: (id: string) => void
}

function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
  onDelete,
}: ApplicationDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState(application.company)
  const [role, setRole] = useState(application.role)
  const [status, setStatus] = useState<ApplicationStatus>(application.status)
  const [notes, setNotes] = useState(application.notes)

  const handleCancelEdit = () => {
    setCompany(application.company)
    setRole(application.role)
    setStatus(application.status)
    setNotes(application.notes)
    setIsEditing(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    onUpdate(application.id, {
      company,
      role,
      status,
      appliedDate: application.appliedDate,
      matchLevel: application.matchLevel,
      notes,
    })
    onClose()
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-start mb-4 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing
              ? 'Edit application'
              : `${application.role} @ ${application.company}`}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
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
              <label className="block text-sm font-semibold text-slate-500 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 mb-1"
              />
            </form>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Status</dt>
                <dd className="text-slate-900">{application.status}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Applied date</dt>
                <dd className="text-slate-900">{application.appliedDate}</dd>
              </div>
              {application.matchLevel && (
                <div>
                  <dt className="font-semibold text-slate-500">Match level</dt>
                  <dd className="text-slate-900 capitalize">
                    {application.matchLevel}
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-slate-500">Notes</dt>
                <dd className="text-slate-900 whitespace-pre-wrap">
                  {application.notes || 'No notes.'}
                </dd>
              </div>
            </dl>
          )}
        </div>

        <div className="flex gap-2 mt-5 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(application.id)}
                className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailModal
