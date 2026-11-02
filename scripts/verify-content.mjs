import { createClient } from '@libsql/client'
import fs from 'node:fs'
import path from 'node:path'

const base = process.env.SITE_URL || 'http://localhost:3000'
const db = createClient({ url: process.env.DATABASE_URL || 'file:./data/pci.db' })
const failures = []

async function rows(sql) {
  return (await db.execute(sql)).rows
}

async function checkRoute(route) {
  const response = await fetch(new URL(route, base))
  const html = await response.text()
  if (response.status !== 200) failures.push(`${route}: HTTP ${response.status}`)
  if (/\b(?:src|poster)="https?:\/\/(?:www\.)?pcicablesindustries\.com/i.test(html)) failures.push(`${route}: remote WordPress asset`)
}

try {
  const [pages, posts, products, media] = await Promise.all([
    rows('select slug from pages'), rows('select slug from posts'),
    rows('select slug from products'), rows('select filename,url from media'),
  ])
  const expected = { pages: 19, posts: 3, products: 14, media: 219 }
  for (const [name, count] of Object.entries({ pages: pages.length, posts: posts.length, products: products.length, media: media.length })) {
    if (count !== expected[name]) failures.push(`${name}: expected ${expected[name]}, found ${count}`)
  }
  for (const item of media) {
    if (!item.filename || !fs.existsSync(path.join('data/media', String(item.filename)))) failures.push(`missing media file: ${item.filename}`)
    if (!String(item.url).startsWith('/api/media/file/')) failures.push(`nonlocal media URL: ${item.filename}`)
  }
  for (const page of pages) await checkRoute(`/${page.slug}/`)
  for (const post of posts) await checkRoute(`/news/${post.slug}/`)
  for (const product of products) await checkRoute(`/products/${product.slug}/`)
  await checkRoute('/')
  console.log(`Checked ${pages.length} pages, ${posts.length} posts, ${products.length} products, ${media.length} local media files.`)
  if (failures.length) {
    console.error(failures.join('\n'))
    process.exitCode = 1
  } else {
    console.log('All public routes and local media checks passed.')
  }
} finally {
  db.close()
}
