import { create } from 'zustand'
import type { ResumeAnalysis, JobMatchResult, JobRequirements } from '../types'

type CareerStore = {
  resumeAnalysis: ResumeAnalysis | null
  jobMatchResult: JobMatchResult | null
  jobRequirements: JobRequirements | null
  setResumeAnalysis: (analysis: ResumeAnalysis) => void
  setJobMatchResult: (result: JobMatchResult) => void
  setJobRequirements: (requirements: JobRequirements) => void
}

export const useCareerStore = create<CareerStore>((set) => ({
  resumeAnalysis: null,
  jobMatchResult: null,
  jobRequirements: null,
  setResumeAnalysis: (analysis) => set({ resumeAnalysis: analysis }),
  setJobMatchResult: (result) => set({ jobMatchResult: result }),
  setJobRequirements: (requirements) => set({ jobRequirements: requirements }),
}))
