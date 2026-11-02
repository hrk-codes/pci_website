import type { CollectionConfig, GlobalConfig } from 'payload'
import { publishedOrSignedIn, signedIn } from './access'

const legacyId = {
  name: 'legacyId',
  type: 'number',
  unique: true,
  admin: { position: 'sidebar' },
} as const

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  fields: [],
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'title' },
  access: { read: () => true, create: signedIn, update: signedIn, delete: signedIn },
  upload: {
    staticDir: 'data/media',
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    imageSizes: [
      { name: 'card', width: 720, height: 520, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'alt', type: 'text' },
    { ...legacyId },
    { name: 'sourceUrl', type: 'text', admin: { readOnly: true } },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'eyebrow', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'body', type: 'richText' },
    { name: 'heroMedia', type: 'relationship', relationTo: 'media' },
    { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'sourceHtml', type: 'textarea', maxLength: 200000, admin: { readOnly: true, condition: (_, data) => Boolean(data?.legacyId) } },
    { ...legacyId },
  ],
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', '_status'] },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category', type: 'select', required: true,
      options: [
        { label: 'Cables', value: 'cables' },
        { label: 'Conductors', value: 'conductors' },
        { label: 'Earth Wire', value: 'earth-wire' },
      ],
    },
    { name: 'summary', type: 'textarea' },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'relationship', relationTo: 'media' },
    { name: 'datasheet', type: 'relationship', relationTo: 'media' },
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'textarea' },
    { name: 'body', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
    { name: 'heroMedia', type: 'relationship', relationTo: 'media' },
    { ...legacyId },
  ],
}

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: { useAsTitle: 'email', defaultColumns: ['formType', 'email', 'emailStatus', 'createdAt'] },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  fields: [
    { name: 'formType', type: 'select', required: true, options: ['contact', 'vendor-registration'] },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'details', type: 'json' },
    { name: 'emailStatus', type: 'select', required: true, defaultValue: 'pending', options: ['pending', 'sent', 'failed'] },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: signedIn },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'PCI Cables Industries Pvt Ltd' },
    { name: 'tagline', type: 'text', defaultValue: 'Powering progress with dependable cable and conductor solutions' },
    { name: 'contactEmail', type: 'email', defaultValue: 'info@pcicablesindustries.com' },
    { name: 'logo', type: 'relationship', relationTo: 'media' },
  ],
}
