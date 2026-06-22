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
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-3">1. Upload your resume</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="text-white"
      />
      {isAnalyzing && <p className="text-slate-400 mt-3">Analyzing...</p>}
    </div>
  )
}

export default ResumeUpload
