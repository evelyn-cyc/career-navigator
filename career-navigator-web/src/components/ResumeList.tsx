import type { ResumeAnalysis } from '../types'

type ResumeListProps = {
  resumes: ResumeAnalysis[]
  onView: (resume: ResumeAnalysis) => void
}

function ResumeList({ resumes, onView }: ResumeListProps) {
  if (resumes.length === 0) {
    return <p className="text-slate-500">No resumes saved yet.</p>
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          onClick={() => onView(resume)}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer transition hover:border-blue-300 hover:shadow-md"
        >
          <p className="text-slate-900 font-bold">{resume.name}</p>
          <p className="text-slate-500 text-sm">
            Uploaded {resume.uploadedDate}
          </p>
          <p className="text-slate-500 text-sm">
            {resume.extractedSkills.length} skills
          </p>
        </div>
      ))}
    </div>
  )
}

export default ResumeList
