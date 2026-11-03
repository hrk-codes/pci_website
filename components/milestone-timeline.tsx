'use client'

import { useState } from 'react'

export function MilestoneTimeline({ milestones }: { milestones: { year: string; description: string }[] }) {
  const [active, setActive] = useState(Math.max(0, milestones.length - 1))
  if (!milestones.length) return null
  return <div className="milestone-timeline">
    <div className="milestone-feature" aria-live="polite"><span>{milestones[active].year}</span><p>{milestones[active].description}</p></div>
    <div className="milestone-track" aria-label="PCI milestones">
      {milestones.map((milestone, index) => <button type="button" className={active === index ? 'is-active' : ''} key={`${milestone.year}-${index}`} onClick={() => setActive(index)} aria-pressed={active === index}><span className="milestone-dot" /><span>{milestone.year}</span></button>)}
    </div>
  </div>
}
