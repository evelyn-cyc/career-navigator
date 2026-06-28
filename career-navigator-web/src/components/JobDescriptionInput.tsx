import { useState } from 'react'
import { useCareerStore } from '../store/useCareerStore'
import { mockJobMatchResult } from '../mocks/mockData'

function JobDescriptionInput() {
  const [jobText, setJobText] = useState('')
  const [isMatching, setIsMatching] = useState(false)
  const resumeAnalysis = useCareerStore((state) => state.resumeAnalysis)
  const setJobMatchResult = useCareerStore((state) => state.setJobMatchResult)

  const handleSubmit = () => {
    if (!jobText.trim()) return

    setIsMatching(true)
    setTimeout(() => {
      setJobMatchResult(mockJobMatchResult)
      setIsMatching(false)
    }, 800)
  }

  const isDisabled = !resumeAnalysis

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">
        2. Paste a job description
      </h2>
      <textarea
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        disabled={isDisabled}
        rows={6}
        placeholder={
          isDisabled
            ? 'Upload your resume first'
            : 'Paste the job description here...'
        }
        className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Match
      </button>
      {isMatching && <p className="text-slate-500 mt-3">Matching...</p>}
    </div>
  )
}

export default JobDescriptionInput
