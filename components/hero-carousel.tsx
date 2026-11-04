'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type HeroSlide = { image: string; label: string; title: string; description: string; href: string; action: string }

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % slides.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  if (!slides.length) return null

  return <section className="hero-carousel" aria-label="PCI Cables highlights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
    <div className="hero-slides">
      {slides.map((slide, index) => <div className={`hero-slide${index === active ? ' is-active' : ''}`} key={slide.title} aria-hidden={index !== active}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : undefined} decoding="async" />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p className="kicker light">{slide.label}</p>
          <h1>{slide.title}</h1>
          <p className="hero-description">{slide.description}</p>
          <Link className="button button-accent" href={slide.href} tabIndex={index === active ? 0 : -1}>{slide.action}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>)}
    </div>
    <div className="hero-controls shell">
      <div className="hero-dots" aria-label="Choose a highlight">{slides.map((slide, index) => <button type="button" key={slide.title} className={index === active ? 'is-active' : ''} aria-label={`Show highlight ${index + 1}: ${slide.label}`} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)} />)}</div>
      <div className="hero-arrows"><button type="button" aria-label="Previous highlight" onClick={() => setActive((active - 1 + slides.length) % slides.length)}>←</button><button type="button" aria-label="Next highlight" onClick={() => setActive((active + 1) % slides.length)}>→</button></div>
    </div>
    <span className="hero-side-note">PCI Cables Industries / Since 2013</span>
  </section>
}
