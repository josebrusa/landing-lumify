import type { CrmMeeting } from '@/types/api'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Format Date as UTC ICS timestamp YYYYMMDDTHHMMSSZ */
export function toIcsUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

export function buildMeetingIcs(meeting: CrmMeeting, title: string): string {
  const uid = `${meeting.id}@lumify.es`
  const stamp = toIcsUtc(new Date())
  const start = toIcsUtc(new Date(meeting.startsAt))
  const end = toIcsUtc(new Date(meeting.endsAt))
  const summary = title.replace(/[,;\\]/g, ' ')
  const location = (meeting.locationOrUrl || '').replace(/[,;\\]/g, ' ')
  const description = (meeting.notes || '').replace(/\n/g, '\\n').replace(/[,;\\]/g, ' ')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lumify//CRM//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    location ? `LOCATION:${location}` : '',
    description ? `DESCRIPTION:${description}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

export function downloadIcsFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Monday 00:00 local of the week containing `ref`. */
export function startOfWeekMonday(ref: Date): Date {
  const d = new Date(ref)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 Sun
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function toIsoLocalDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${pad(h)}:${pad(m)}`
}
