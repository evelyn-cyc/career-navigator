import type { MatchLevel } from '../types'

function getMatchLevel(ratio: number): MatchLevel {
  if (ratio >= 0.8) return 'strong'
  if (ratio >= 0.6) return 'good'
  if (ratio >= 0.4) return 'moderate'
  if (ratio >= 0.2) return 'weak'
  return 'mismatch'
}

export function computeMatch(
  requiredSkills: string[],
  resumeSkills: string[],
): {
  matchLevel: MatchLevel
  matchedSkills: string[]
  missingSkills: string[]
} {
  const resumeSkillsLower = resumeSkills.map((skill) => skill.toLowerCase())

  const matchedSkills = requiredSkills.filter((skill) =>
    resumeSkillsLower.includes(skill.toLowerCase()),
  )
  const missingSkills = requiredSkills.filter(
    (skill) => !resumeSkillsLower.includes(skill.toLowerCase()),
  )

  const ratio =
    requiredSkills.length === 0
      ? 0
      : matchedSkills.length / requiredSkills.length

  return { matchLevel: getMatchLevel(ratio), matchedSkills, missingSkills }
}
