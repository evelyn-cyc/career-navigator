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

export type JobMatchRecord = {
  resumeId: string
  resumeName: string
  matchLevel: MatchLevel
  matchedSkills: string[]
  missingSkills: string[]
  matchedDate: string
}

export type ApplicationStatus =
  | 'Applied'
  | 'Interviewing'
  | 'Offer'
  | 'Rejected'

export type ApplicationAttempt = {
  attemptId: string
  status: ApplicationStatus
  appliedDate: string
  matchLevel?: MatchLevel // frozen at attempt time — see decisions.md
  notes?: string
}

export type Job = JobPostingDetails & {
  id: string
  savedDate: string
  pinned?: boolean
  requiredSkills: string[]
  matches?: JobMatchRecord[]
  applications?: ApplicationAttempt[]
}