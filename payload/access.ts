import type { Access } from 'payload'

export const signedIn: Access = ({ req }) => Boolean(req.user)

export const publishedOrSignedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
