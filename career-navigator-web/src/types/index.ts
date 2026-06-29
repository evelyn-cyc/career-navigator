export type ResumeAnalysis = {
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

export type JobMatchResult = JobPostingDetails & {
  matchLevel: MatchLevel
  matchedSkills: string[]
  missingSkills: string[]
  suggestedKeywords: string[]
}

export type JobRequirements = JobPostingDetails & {
  requiredSkills: string[]
}

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'OA'
  | 'Interview'
  | 'Offer'
  | 'Rejected'

export type Application = {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
  matchLevel?: MatchLevel
  contactEmail?: string
  applicationUrl?: string
  notes: string
}
