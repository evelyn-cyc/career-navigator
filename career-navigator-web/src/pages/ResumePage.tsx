import ResumeUpload from '../components/ResumeUpload'
import ResumeAnalysisView from '../components/ResumeAnalysisView'

function ResumePage() {
  return (
    <div>
      <header className="mb-6 pb-5 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Resume Analysis
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Resume Analysis</h1>
        <p className="text-slate-500 mt-2 max-w-xl">
          Upload your resume to see your detected skills and ways to strengthen
          it.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 items-start">
        <ResumeUpload />
        <ResumeAnalysisView />
      </div>
    </div>
  )
}

export default ResumePage
