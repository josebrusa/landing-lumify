export type MailpitAddress = {
  Name?: string
  Address: string
}

export type MailpitMessageSummary = {
  ID: string
  From?: MailpitAddress
  To?: MailpitAddress[]
  Subject?: string
  Snippet?: string
  Created?: string
}

export type MailpitMessagesResponse = {
  total: number
  messages: MailpitMessageSummary[]
}

const mailpitBase = () =>
  (process.env.E2E_MAILPIT_URL ?? 'http://127.0.0.1:8025').replace(/\/$/, '')

export async function clearMailpit(): Promise<void> {
  const res = await fetch(`${mailpitBase()}/api/v1/messages`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(
      `Mailpit clear failed: ${res.status} ${res.statusText}. Is Mailpit running at ${mailpitBase()}?`,
    )
  }
}

export async function listMailpitMessages(): Promise<MailpitMessageSummary[]> {
  const res = await fetch(`${mailpitBase()}/api/v1/messages`)
  if (!res.ok) {
    throw new Error(
      `Mailpit list failed: ${res.status} ${res.statusText}. Is Mailpit running at ${mailpitBase()}?`,
    )
  }
  const body = (await res.json()) as MailpitMessagesResponse
  return body.messages ?? []
}

function recipientsOf(msg: MailpitMessageSummary): string[] {
  return (msg.To ?? []).map((t) => t.Address.toLowerCase())
}

export async function waitForMailpitMessages(opts: {
  toAddresses: string[]
  timeoutMs?: number
  pollMs?: number
}): Promise<MailpitMessageSummary[]> {
  const timeoutMs = opts.timeoutMs ?? 20_000
  const pollMs = opts.pollMs ?? 500
  const needed = opts.toAddresses.map((a) => a.toLowerCase())
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    const messages = await listMailpitMessages()
    const found = needed.every((addr) =>
      messages.some((m) => recipientsOf(m).includes(addr)),
    )
    if (found) {
      return messages
    }
    await new Promise((r) => setTimeout(r, pollMs))
  }

  const latest = await listMailpitMessages()
  const seen = latest.flatMap((m) => recipientsOf(m))
  throw new Error(
    [
      `Timed out waiting for Mailpit messages to: ${needed.join(', ')}.`,
      `Seen recipients: ${seen.length ? seen.join(', ') : '(none)'}.`,
      'Check: API SMTP points at Mailpit (SMTP_HOST=127.0.0.1 SMTP_PORT=1025),',
      'an admin user exists in local DB (pnpm run seed), and Mailpit is up.',
    ].join(' '),
  )
}
