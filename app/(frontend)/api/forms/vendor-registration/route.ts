import { submitForm } from '@/lib/forms'

export async function POST(request: Request) {
  return submitForm(request, 'vendor-registration')
}
