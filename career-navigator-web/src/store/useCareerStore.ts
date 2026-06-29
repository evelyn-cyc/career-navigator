import { create } from 'zustand'
import type { JobRequirements } from '../types'

type CareerStore = {
  jobRequirements: JobRequirements | null
  setJobRequirements: (requirements: JobRequirements) => void
}

export const useCareerStore = create<CareerStore>((set) => ({
  jobRequirements: null,
  setJobRequirements: (requirements) => set({ jobRequirements: requirements }),
}))
