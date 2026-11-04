import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { MediaAsset } from '@/lib/site-data'

export function findMedia(media: MediaAsset[], filename: string) {
  return media.find((item) => item.filename?.toLowerCase() === filename.toLowerCase()) || null
}

type TextNode = { text?: string; children?: TextNode[] }

function nodeText(node: TextNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children || []).map(nodeText).join(' ')
}

export function contentParagraphs(value?: SerializedEditorState | null): string[] {
  const root = value?.root as TextNode | undefined
  return (root?.children || []).map(nodeText).map((text) => text.trim()).filter(Boolean)
}

export function milestonesFromContent(value?: SerializedEditorState | null) {
  const lines = contentParagraphs(value)
  const milestones: { year: string; description: string }[] = []
  for (let index = 0; index < lines.length - 1; index++) {
    const year = lines[index].match(/^(20\d{2})$/)?.[1]
    if (year) milestones.push({ year, description: lines[index + 1] })
  }
  return milestones
}

export function clientGroups(media: MediaAsset[]) {
  const groups = [
    {
      label: 'Power utilities',
      files: ['WBSEDCL.png', 'WBPDCL.png', 'MSEDCL.png', 'NHPC.png', 'PSPCL.png', 'GETCO.png', 'UHBVN.png', 'TPTL.png', 'KSEB.png', 'AEGCL.png', 'APDCL.png', 'CSPDCL.png'],
    },
    {
      label: 'Rail & public sector',
      files: ['RVNL.png', 'Delhi-Metro.png', 'Kolkata-Metro.png', 'mumbai-metro.png', 'Patna-Metro.png', 'Chennai-Metro.png', 'Bangaluru-Metro.png', 'CoalIndia.png', 'DFCC.png', 'IRCON.png', 'CORE.png', 'Northern-Railway.png'],
    },
    {
      label: 'International & renewable',
      files: ['NEA-Nepal.png', 'UETCL-Uganda.png', 'HUMA-Ciment-Uganda.png', 'BPC-Bhutan.png', 'EDCL-Rwanda.png', 'EDM-Mozambique.png', 'TCN-Nigeria.png', 'ACME.png', 'AVAADA.png', 'solarcraft.png', 'sprng.png', 'renew.png'],
    },
  ]

  const selected = groups.map((group) => ({
    label: group.label,
    logos: group.files.map((filename) => findMedia(media, filename)).filter((item): item is MediaAsset => Boolean(item)),
  })).filter((group) => group.logos.length > 0)

  const used = new Set(selected.flatMap((group) => group.logos.map((item) => item.id)))
  const excluded = /^(ChatGPT|Artboard|ECO|PVC|LT-|AAC|ACSR|ACAR|Aerial|sevice|Blank|logo|KONEXA-1)/i
  const remaining = media.filter((item) => item.mimeType === 'image/png' && item.filename && !excluded.test(item.filename) && !used.has(item.id))
  if (remaining.length) selected.push({ label: 'More organizations', logos: remaining })
  return selected
}
