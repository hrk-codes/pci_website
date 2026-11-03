'use client'

import { useState } from 'react'
import { mediaUrl, type MediaAsset } from '@/lib/media'

export function ClientShowcase({ groups }: { groups: { label: string; logos: MediaAsset[] }[] }) {
  const [active, setActive] = useState(0)
  if (!groups.length) return null
  return <div className="client-showcase">
    <div className="client-tabs" role="tablist" aria-label="Client groups">
      {groups.map((group, index) => <button type="button" role="tab" id={`client-tab-${index}`} aria-controls={`client-panel-${index}`} aria-selected={active === index} className={active === index ? 'is-active' : ''} key={group.label} onClick={() => setActive(index)}>{group.label}</button>)}
    </div>
    {groups.map((group, index) => <div className="client-panel" id={`client-panel-${index}`} role="tabpanel" aria-labelledby={`client-tab-${index}`} hidden={active !== index} key={group.label}>
      {group.logos.map((logo) => <div className="client-logo" key={logo.id} title={logo.title || logo.filename || ''}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(logo, 'card') || ''} alt={logo.alt || logo.title || logo.filename?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'PCI client'} loading="lazy" decoding="async" />
      </div>)}
    </div>)}
  </div>
}
