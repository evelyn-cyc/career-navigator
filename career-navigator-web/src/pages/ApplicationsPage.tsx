import { useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import { useResumes } from '../hooks/useResumes'
import ApplicationForm from '../components/ApplicationForm'
import ApplicationList from '../components/ApplicationList'
import ApplicationDetailModal from '../components/ApplicationDetailModal'
import type { Application } from '../types'

function ApplicationsPage() {
  const {
    applications,
    addApplication,
    updateStatus,
    updateApplication,
    deleteApplication,
  } = useApplications()
  const { resumes } = useResumes()
  const [viewingApplication, setViewingApplication] =
    useState<Application | null>(null)

  const handleUpdateFromModal = (id: string, data: Omit<Application, 'id'>) => {
    updateApplication(id, data)
    setViewingApplication({ id, ...data })
  }

  const handleDeleteFromModal = (id: string) => {
    deleteApplication(id)
    setViewingApplication(null)
  }

  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Applications
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Add new applications and keep notes on every stage, from saved through
          offer.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 items-start">
        <ApplicationForm onAdd={addApplication} />
        <ApplicationList
          applications={applications}
          onUpdateStatus={updateStatus}
          onView={setViewingApplication}
        />
      </div>

      {viewingApplication && (
        <ApplicationDetailModal
          application={viewingApplication}
          resumes={resumes}
          onClose={() => setViewingApplication(null)}
          onUpdate={handleUpdateFromModal}
          onDelete={handleDeleteFromModal}
        />
      )}
    </div>
  )
}

export default ApplicationsPage
