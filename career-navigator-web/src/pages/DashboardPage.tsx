import { useApplications } from '../hooks/useApplications'
import Dashboard from '../components/Dashboard'

function DashboardPage() {
  const { applications } = useApplications()

  return (
    <div>
      <Dashboard applications={applications} />
    </div>
  )
}

export default DashboardPage
