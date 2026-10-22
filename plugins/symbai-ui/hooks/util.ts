import type { McpToolResult } from 'claude-code'

export function textOf(result: McpToolResult): string {
  return result.content
    .map(block => (block.type === 'text' && typeof block.text === 'string' ? block.text : ''))
    .join('')
}

export function jsonOf(result: McpToolResult): Record<string, any> | null {
  if (result.structuredContent && typeof result.structuredContent === 'object') {
    return result.structuredContent as Record<string, any>
  }
  try {
    return JSON.parse(textOf(result))
  } catch {
    return null
  }
}

export function errorOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

export const str = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

export const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((one): one is string => typeof one === 'string') : []

export const num = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

export function shortTime(value: string | null): string {
  if (!value) return '—'
  // "2026-10-20 13:40:39" → "20.10 13:40"
  const match = /^\d{4}-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(value)
  return match ? `${match[2]}.${match[1]} ${match[3]}:${match[4]}` : value
}

export function splitWords(value: string): string[] {
  return value
    .split(',')
    .map(one => one.trim())
    .filter(one => one.length > 0)
}
