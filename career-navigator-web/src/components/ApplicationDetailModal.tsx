import { useState } from 'react'
import { X } from 'lucide-react'
import MatchGauge from './MatchGauge'
import { computeMatch } from '../utils/matching'
import type { Application, ApplicationStatus, ResumeAnalysis } from '../types'

type ApplicationDetailModalProps = {
  application: Application
  resumes: ResumeAnalysis[]
  onClose: () => void
  onUpdate: (id: string, data: Omit<Application, 'id'>) => void
  onDelete: (id: string) => void
}

function ApplicationDetailModal({
  application,
  resumes,
  onClose,
  onUpdate,
  onDelete,
}: ApplicationDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState(application.company)
  const [role, setRole] = useState(application.role)
  const [status, setStatus] = useState<ApplicationStatus>(application.status)
  const [contactEmail, setContactEmail] = useState(
    application.contactEmail ?? '',
  )
  const [applicationUrl, setApplicationUrl] = useState(
    application.applicationUrl ?? '',
  )
  const [notes, setNotes] = useState(application.notes)
  const [selectedResumeId, setSelectedResumeId] = useState(
    application.matchedResumeId ?? '',
  )

  const handleCancelEdit = () => {
    setCompany(application.company)
    setRole(application.role)
    setStatus(application.status)
    setContactEmail(application.contactEmail ?? '')
    setApplicationUrl(application.applicationUrl ?? '')
    setNotes(application.notes)
    setIsEditing(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    const { id, ...rest } = application
    onUpdate(id, {
      ...rest,
      company,
      role,
      status,
      contactEmail: contactEmail.trim() || undefined,
      applicationUrl: applicationUrl.trim() || undefined,
      notes,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${application.role} @ ${application.company}? This can't be undone.`,
    )
    if (confirmed) onDelete(application.id)
  }

  const handleRunMatch = () => {
    const resume = resumes.find((r) => r.id === selectedResumeId)
    if (!resume || !application.requiredSkills) return

    const result = computeMatch(
      application.requiredSkills,
      resume.extractedSkills,
    )

    const { id, ...rest } = application
    onUpdate(id, {
      ...rest,
      ...result,
      matchedResumeId: resume.id,
      matchedDate: new Date().toISOString().split('T')[0],
    })
  }

  const matchedResumeName = resumes.find(
    (resume) => resume.id === application.matchedResumeId,
  )?.name

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-start mb-4 shrink-0">
          {isEditing ? (
            <h2 className="text-lg font-bold text-slate-900">
              Edit application
            </h2>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {application.role}
              </h2>
              <p className="text-sm text-slate-500">{application.company}</p>
            </div>
          )}
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
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 mb-1"
              />
            </form>
          ) : (
            <>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Status</dt>
                  <dd className="text-slate-900">{application.status}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Applied date</dt>
                  <dd className="text-slate-900">{application.appliedDate}</dd>
                </div>
                {application.contactEmail && (
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Contact email
                    </dt>
                    <dd>
                      <a
                        href={`mailto:${application.contactEmail}`}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {application.contactEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {application.applicationUrl && (
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Application link
                    </dt>
                    <dd>
                      <a
                        href={application.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {application.applicationUrl}
                      </a>
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

              {application.requiredSkills &&
                application.requiredSkills.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-500 mb-2">
                      Match against a resume
                    </p>
                    {resumes.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Upload a resume on the Resume Analysis page first.
                      </p>
                    ) : (
                      <>
                        <div className="flex gap-2 mb-3">
                          <select
                            value={selectedResumeId}
                            onChange={(e) =>
                              setSelectedResumeId(e.target.value)
                            }
                            className="flex-1 min-w-0 p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 truncate"
                          >
                            <option value="">Choose a resume...</option>
                            {resumes.map((resume) => (
                              <option key={resume.id} value={resume.id}>
                                {resume.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleRunMatch}
                            disabled={!selectedResumeId}
                            className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Run Match
                          </button>
                        </div>

                        {application.matchLevel &&
                          application.matchedSkills &&
                          application.missingSkills && (
                            <div>
                              <MatchGauge
                                level={application.matchLevel}
                                showLabels
                              />
                              {matchedResumeName && (
                                <p className="text-sm text-slate-500 mt-3 mb-2">
                                  Matched against: {matchedResumeName}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-slate-500 mb-1 mt-3">
                                Matched Skills
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {application.matchedSkills.map((skill) => (
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
                              <div className="flex flex-wrap gap-2">
                                {application.missingSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-sm font-semibold rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}
            </>
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
                onClick={handleDelete}
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
