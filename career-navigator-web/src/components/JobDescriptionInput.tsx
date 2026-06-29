import { useState } from 'react'
import { useCareerStore } from '../store/useCareerStore'
import { mockJobMatchResult, mockJobRequirements } from '../mocks/mockData'

function JobDescriptionInput() {
  const [jobText, setJobText] = useState('')
  const [isMatching, setIsMatching] = useState(false)
  const resumeAnalysis = useCareerStore((state) => state.resumeAnalysis)
  const setJobMatchResult = useCareerStore((state) => state.setJobMatchResult)
  const setJobRequirements = useCareerStore((state) => state.setJobRequirements)

  const handleSubmit = () => {
    if (!jobText.trim()) return

    setIsMatching(true)
    setTimeout(() => {
      if (resumeAnalysis) {
        setJobMatchResult(mockJobMatchResult)
      } else {
        setJobRequirements(mockJobRequirements)
      }
      setIsMatching(false)
    }, 800)
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">
        Paste a job description
      </h2>
      {!resumeAnalysis && (
        <p className="text-sm text-slate-500 mb-3">
          You can extract this job's requirements now — upload your resume first
          to see a full match score instead.
        </p>
      )}
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
        {resumeAnalysis ? 'Match' : 'Extract Requirements'}
      </button>
      {isMatching && (
        <p className="text-slate-500 mt-3">
          {resumeAnalysis ? 'Matching...' : 'Extracting...'}
        </p>
      )}
    </div>
  )
}

export default JobDescriptionInput
