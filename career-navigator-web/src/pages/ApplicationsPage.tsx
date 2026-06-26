import { useApplications } from '../hooks/useApplications'
import ApplicationForm from '../components/ApplicationForm'
import ApplicationList from '../components/ApplicationList'

function ApplicationsPage() {
  const { applications, addApplication, updateStatus, deleteApplication } =
    useApplications()

  return (
    <div>
      <ApplicationForm onAdd={addApplication} />
      <ApplicationList
        applications={applications}
        onUpdateStatus={updateStatus}
        onDelete={deleteApplication}
      />
    </div>
  )
}

export default ApplicationsPage
