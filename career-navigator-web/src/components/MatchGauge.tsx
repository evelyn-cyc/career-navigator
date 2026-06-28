import type { MatchLevel } from '../types'

const gaugeLevels: {
  level: MatchLevel
  active: string
  soft: string
  label: string
}[] = [
  {
    level: 'mismatch',
    active: 'bg-red-600',
    soft: 'bg-red-100',
    label: 'Mismatch',
  },
  {
    level: 'weak',
    active: 'bg-orange-600',
    soft: 'bg-orange-100',
    label: 'Weak',
  },
  {
    level: 'moderate',
    active: 'bg-amber-600',
    soft: 'bg-amber-100',
    label: 'Moderate',
  },
  { level: 'good', active: 'bg-blue-600', soft: 'bg-blue-100', label: 'Good' },
  {
    level: 'strong',
    active: 'bg-green-600',
    soft: 'bg-green-100',
    label: 'Strong',
  },
]

type MatchGaugeProps = {
  level: MatchLevel
  mini?: boolean
  showLabels?: boolean
}

function MatchGauge({
  level,
  mini = false,
  showLabels = false,
}: MatchGaugeProps) {
  return (
    <div>
      <div className="flex gap-1">
        {gaugeLevels.map((cell) => {
          const isActive = cell.level === level
          return (
            <span
              key={cell.level}
              className={`flex-1 rounded-full ${isActive ? cell.active : cell.soft} ${
                mini ? (isActive ? 'h-2' : 'h-1.5') : isActive ? 'h-3' : 'h-2'
              }`}
            />
          )
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
          {gaugeLevels.map((cell) => (
            <span key={cell.level}>{cell.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchGauge
