import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { FormSubmissions, Media, Pages, Posts, Products, SiteSettings, Users } from './payload/collections'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  collections: [Users, Media, Pages, Products, Posts, FormSubmissions],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URL || 'file:./data/pci.db' } }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
