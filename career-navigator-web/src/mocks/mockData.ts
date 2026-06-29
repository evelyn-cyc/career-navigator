import type { ResumeAnalysis, JobRequirements } from '../types'

export const mockResumeAnalysis: Omit<
  ResumeAnalysis,
  'id' | 'name' | 'uploadedDate'
> = {
  extractedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
  projects: [
    'Aussie EcoLens - Image classification web app',
    'Lumora - Canvas-based recognition app',
  ],
  experience: ['Frontend Developer Intern, 6 months'],
  suggestions: [
    'Add more detail to project impact/results',
    'Mention any testing experience',
  ],
}

export const mockJobRequirements: JobRequirements = {
  requiredSkills: ['React', 'TypeScript', 'REST APIs', 'Docker', 'AWS'],
  company: 'aiDevelop',
  role: 'Frontend Developer',
  employmentType: 'Full-time',
  location: 'Melbourne, VIC',
  workArrangement: 'Hybrid',
  salaryRange: '$90,000 - $110,000 AUD',
  startDate: '2026-08-01',
  endDate: '2027-08-01',
  workingHours: '38 hrs/week',
  citizenshipRequirement: 'Australian citizen or permanent resident required',
  contactEmail: 'careers@aidevelop.com',
  applicationUrl: 'https://aidevelop.com/careers/frontend-developer',
}
