import { useState, useEffect } from 'react'
import type { Job } from '../types'

const STORAGE_KEY = 'career-navigator-jobs'

function loadJobs(): Job[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(loadJobs)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  }, [jobs])

  const addJob = (data: Omit<Job, 'id'>) => {
    const newJob: Job = { ...data, id: crypto.randomUUID() }
    setJobs((prev) => [newJob, ...prev]) // newest first
  }

  // Partial update — used for targeted changes like attaching a resume or
  // writing a match snapshot without needing to pass the whole Job object.
  const updateJob = (id: string, data: Partial<Omit<Job, 'id'>>) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...data } : job)),
    )
  }

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id))
  }

  return { jobs, addJob, updateJob, deleteJob }
}
