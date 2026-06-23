import ResumeUpload from './components/ResumeUpload'
import ResumeAnalysisView from './components/ResumeAnalysisView'
import JobDescriptionInput from './components/JobDescriptionInput'
import JobMatchResultView from './components/JobMatchResultView'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">AI Career Navigator</h1>
        <ResumeUpload />
        <ResumeAnalysisView />
        <JobDescriptionInput />
        <JobMatchResultView />
      </div>
    </div>
  )
}

export default App