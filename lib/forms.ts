import nodemailer from 'nodemailer'
import { z } from 'zod'
import { cms } from '@/lib/site-data'

const text = z.string().trim().min(1).max(500)
const schema = z.object({
  name: text,
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
  category: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().max(200).optional().default(''),
  address: z.string().trim().max(500).optional().default(''),
  pinCode: z.string().trim().max(20).optional().default(''),
  companyStatus: z.string().trim().max(100).optional().default(''),
  firmType: z.string().trim().max(100).optional().default(''),
  gst: z.string().trim().max(30).optional().default(''),
  pan: z.string().trim().max(30).optional().default(''),
  designation: z.string().trim().max(100).optional().default(''),
  website: z.string().max(200).optional().default(''),
})

const recent = new Map<string, number>()

export async function submitForm(request: Request, formType: 'contact' | 'vendor-registration') {
  const origin = request.headers.get('origin')
  const expected = new URL(request.url).origin
  if (origin && origin !== expected) return Response.json({ error: 'Invalid form origin.' }, { status: 403 })
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const key = `${formType}:${ip}`
  const now = Date.now()
  if (now - (recent.get(key) || 0) < 15_000) return Response.json({ error: 'Please wait before submitting again.' }, { status: 429 })

  let input: z.infer<typeof schema>
  try {
    const raw = await request.json()
    input = schema.parse(raw)
  } catch {
    return Response.json({ error: 'Please check the required fields and try again.' }, { status: 400 })
  }
  if (!input.phone || !input.company || (formType === 'contact' && input.message.length < 10) || (formType === 'vendor-registration' && (!input.pinCode || !input.pan))) {
    return Response.json({ error: 'Please complete the required fields.' }, { status: 400 })
  }
  if (input.website) return Response.json({ status: 'pending' })
  recent.set(key, now)
  const payload = await cms()
  const submission = await payload.create({
    collection: 'form-submissions', overrideAccess: true,
    data: {
      formType, name: input.name, email: input.email, phone: input.phone,
      company: input.company, message: input.message,
      details: {
        category: input.category, city: input.city, address: input.address,
        pinCode: input.pinCode, companyStatus: input.companyStatus, firmType: input.firmType,
        gst: input.gst, pan: input.pan, designation: input.designation,
      }, emailStatus: 'pending',
    },
  })

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    return Response.json({ status: 'pending', message: 'Your submission was saved. Email notification is pending setup.' })
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    })
    const lines = [
      `Form: ${formType}`, `Name: ${input.name}`, `Email: ${input.email}`,
      `Phone: ${input.phone}`, `Company: ${input.company}`,
      `Products or services: ${input.category}`, `Address: ${input.address}`,
      `City: ${input.city}`, `Pin code: ${input.pinCode}`,
      `Company status: ${input.companyStatus}`, `Firm type: ${input.firmType}`,
      `GST: ${input.gst}`, `PAN: ${input.pan}`, `Designation: ${input.designation}`,
      '', input.message,
    ]
    await transport.sendMail({
      from: SMTP_FROM, to: 'info@pcicablesindustries.com', replyTo: input.email,
      subject: `PCI website: ${formType === 'contact' ? 'contact enquiry' : 'vendor registration'}`,
      text: lines.join('\n'),
    })
    await payload.update({ collection: 'form-submissions', id: submission.id, overrideAccess: true, data: { emailStatus: 'sent' } })
    return Response.json({ status: 'sent', message: 'Your submission was saved and the email notification was sent.' })
  } catch (error) {
    payload.logger.error({ err: error }, 'Form email failed')
    await payload.update({ collection: 'form-submissions', id: submission.id, overrideAccess: true, data: { emailStatus: 'failed' } })
    return Response.json({ status: 'failed', message: 'Your submission was saved, but the email notification could not be sent.' })
  }
}
