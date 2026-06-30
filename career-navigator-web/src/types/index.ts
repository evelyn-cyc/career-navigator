export type ResumeAnalysis = {
  id: string
  name: string
  uploadedDate: string
  pinned?: boolean
  overview?: string
  extractedSkills: string[]
  projects: string[]
  experience: string[]
  suggestions: string[]
}

export type MatchLevel = 'strong' | 'good' | 'moderate' | 'weak' | 'mismatch'

export type JobPostingDetails = {
  company?: string
  role?: string
  employmentType?: string
  location?: string
  workArrangement?: string
  salaryRange?: string
  startDate?: string
  endDate?: string
  workingHours?: string
  citizenshipRequirement?: string
  contactEmail?: string
  applicationUrl?: string
}

export type JobMatchResult = {
  matchLevel: MatchLevel
  matchedSkills: string[]
  missingSkills: string[]
}

export type JobRequirements = JobPostingDetails & {
  requiredSkills: string[]
}

export type Job = JobPostingDetails & {
  id: string
  savedDate: string
  requiredSkills: string[]
  // optional pre-apply match snapshot (set when a resume is attached before applying)
  attachedResumeId?: string
  matchLevel?: MatchLevel
  matchedSkills?: string[]
  missingSkills?: string[]
  matchedDate?: string
}

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'OA'
  | 'Interview'
  | 'Offer'
  | 'Rejected'

export type Application = JobPostingDetails & {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
  requiredSkills?: string[]
  matchedResumeId?: string
  matchedDate?: string
  matchLevel?: MatchLevel
  matchedSkills?: string[]
  missingSkills?: string[]
  notes: string
}
