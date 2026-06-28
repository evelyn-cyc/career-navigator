import { useState } from 'react'
import { useCareerStore } from '../store/useCareerStore'
import { mockResumeAnalysis } from '../mocks/mockData'

function ResumeUpload() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const setResumeAnalysis = useCareerStore((state) => state.setResumeAnalysis)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    setTimeout(() => {
      setResumeAnalysis(mockResumeAnalysis)
      setIsAnalyzing(false)
    }, 800)
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">
        1. Upload your resume
      </h2>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="text-slate-700"
      />
      {isAnalyzing && <p className="text-slate-500 mt-3">Analyzing...</p>}
    </div>
  )
}

export default ResumeUpload
