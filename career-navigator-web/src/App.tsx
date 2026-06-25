import ResumeUpload from './components/ResumeUpload'
import ResumeAnalysisView from './components/ResumeAnalysisView'
import JobDescriptionInput from './components/JobDescriptionInput'
import JobMatchResultView from './components/JobMatchResultView'
import ApplicationForm from './components/ApplicationForm'
import ApplicationList from './components/ApplicationList'
import { useApplications } from './hooks/useApplications'
import Dashboard from './components/Dashboard'

function App() {
  const { applications, addApplication, updateStatus, deleteApplication } =
    useApplications()

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          AI Career Navigator
        </h1>
        <ResumeUpload />
        <ResumeAnalysisView />
        <JobDescriptionInput />
        <JobMatchResultView />
        <ApplicationForm onAdd={addApplication} />
        <ApplicationList
          applications={applications}
          onUpdateStatus={updateStatus}
          onDelete={deleteApplication}
        />
        <Dashboard applications={applications} />
      </div>
    </div>
  )
}

export default App
