import { useState } from 'react'
import { useCareerStore } from '../store/useCareerStore'
import { mockJobRequirements } from '../mocks/mockData'

function JobDescriptionInput() {
  const [jobText, setJobText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const setJobRequirements = useCareerStore((state) => state.setJobRequirements)

  const handleSubmit = () => {
    if (!jobText.trim()) return

    setIsExtracting(true)
    setTimeout(() => {
      setJobRequirements(mockJobRequirements)
      setIsExtracting(false)
    }, 800)
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">
        Paste a job description
      </h2>
      <textarea
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        rows={6}
        placeholder="Paste the job description here..."
        className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
      />
      <button
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Extract Requirements
      </button>
      {isExtracting && <p className="text-slate-500 mt-3">Extracting...</p>}
    </div>
  )
}

export default JobDescriptionInput
