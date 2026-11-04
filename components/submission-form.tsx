'use client'

import { useState, type FormEvent } from 'react'

export function SubmissionForm({ type, compact = false }: { type: 'contact' | 'vendor-registration'; compact?: boolean }) {
  const [status, setStatus] = useState<{ error?: boolean; message: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const vendor = type === 'vendor-registration'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setStatus(null)
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch(`/api/forms/${type}/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
      const result = await response.json()
      setStatus({ error: !response.ok, message: result.message || result.error || 'Please try again.' })
      if (response.ok) form.reset()
    } catch {
      setStatus({ error: true, message: 'Could not submit the form. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  return <form className={`form-panel${compact ? ' form-compact' : ''}`} onSubmit={submit} aria-busy={busy}>
    {!compact && <><p className="kicker">{vendor ? 'Vendor registration' : 'Contact PCI Cables'}</p>
    <h2>{vendor ? 'Tell us about your business.' : 'How can we help?'}</h2>
    <p className="form-lead">{vendor ? 'Send your company details to the PCI team.' : 'Share your enquiry and the team will review it.'}</p></>}
    <div className="form-grid">
      <div className="form-field"><label htmlFor="form-name">Name *</label><input id="form-name" name="name" required maxLength={500} autoComplete="name" /></div>
      <div className="form-field"><label htmlFor="form-email">Email *</label><input id="form-email" name="email" type="email" required maxLength={254} autoComplete="email" /></div>
      <div className="form-field"><label htmlFor="form-phone">Phone *</label><input id="form-phone" name="phone" type="tel" required maxLength={40} autoComplete="tel" /></div>
      <div className="form-field"><label htmlFor="form-company">Company *</label><input id="form-company" name="company" required maxLength={200} autoComplete="organization" /></div>
      {vendor && <>
        <div className="form-field full"><label htmlFor="form-address">Company address</label><input id="form-address" name="address" maxLength={500} autoComplete="street-address" /></div>
        <div className="form-field"><label htmlFor="form-city">City</label><input id="form-city" name="city" maxLength={200} autoComplete="address-level2" /></div>
        <div className="form-field"><label htmlFor="form-pin">Pin code *</label><input id="form-pin" name="pinCode" required maxLength={20} autoComplete="postal-code" /></div>
        <div className="form-field"><label htmlFor="form-company-status">Company status</label><select id="form-company-status" name="companyStatus"><option value="">Select status</option><option>Manufacturer</option><option>Authorised Dealer</option><option>Stockiest / Trader</option><option>Importer</option><option>Service Provider</option></select></div>
        <div className="form-field"><label htmlFor="form-firm-type">Firm type</label><select id="form-firm-type" name="firmType"><option value="">Select type</option><option>Public Limited Co</option><option>Partnership Co</option><option>Proprietorship Co</option><option>Government Sector</option></select></div>
        <div className="form-field"><label htmlFor="form-gst">GST number</label><input id="form-gst" name="gst" maxLength={30} /></div>
        <div className="form-field"><label htmlFor="form-pan">PAN number *</label><input id="form-pan" name="pan" required maxLength={30} /></div>
        <div className="form-field"><label htmlFor="form-designation">Designation</label><input id="form-designation" name="designation" maxLength={100} autoComplete="organization-title" /></div>
        <div className="form-field"><label htmlFor="form-category">Products or services</label><input id="form-category" name="category" maxLength={200} /></div>
      </>}
      <div className="form-field full"><label htmlFor="form-message">{vendor ? 'Comments' : 'Message *'}</label><textarea id="form-message" name="message" required={!vendor} minLength={vendor ? undefined : 10} maxLength={5000} /></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="form-website">Website</label><input id="form-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </div>
    <button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Send enquiry ↗'}</button>
    {status && <p className={`form-status${status.error ? ' error' : ''}`} role="status">{status.message}</p>}
  </form>
}
