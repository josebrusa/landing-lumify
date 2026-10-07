import { expect, test } from '@playwright/test'
import { clearMailpit, waitForMailpitMessages } from './helpers/mailpit'

const adminEmail = (
  process.env.E2E_ADMIN_EMAIL ?? 'demo@lumify.es'
).toLowerCase()

test.describe('Lead inquiry emails (local Mailpit)', () => {
  test.beforeEach(async () => {
    await clearMailpit()
  })

  test('sends ack to lead and notify to admin', async ({ page }) => {
    const leadEmail = `lead-e2e-${Date.now()}@example.com`
    const company = 'Playwright E2E Co'

    await page.goto('/tech#registro')
    await expect(page.getByTestId('register-form')).toBeVisible()

    await page.getByTestId('register-company').fill(company)
    await page.getByTestId('register-email').fill(leadEmail)
    await page.getByTestId('register-submit').click()

    await expect(page.getByTestId('register-success')).toBeVisible({
      timeout: 20_000,
    })

    const messages = await waitForMailpitMessages({
      toAddresses: [leadEmail, adminEmail],
      timeoutMs: 25_000,
    })

    const toLead = messages.filter((m) =>
      (m.To ?? []).some((t) => t.Address.toLowerCase() === leadEmail),
    )
    const toAdmin = messages.filter((m) =>
      (m.To ?? []).some((t) => t.Address.toLowerCase() === adminEmail),
    )

    expect(toLead.length, 'expected ack email to lead').toBeGreaterThanOrEqual(
      1,
    )
    expect(
      toAdmin.length,
      `expected notify email to admin ${adminEmail}`,
    ).toBeGreaterThanOrEqual(1)

    expect(toAdmin.some((m) => (m.Subject ?? '').includes('lead'))).toBe(true)
    expect(
      toAdmin.some((m) =>
        (m.Snippet ?? '').toLowerCase().includes(leadEmail.toLowerCase()),
      ) ||
        toAdmin.some((m) =>
          (m.Subject ?? '').toLowerCase().includes('pim'),
        ),
    ).toBe(true)
  })
})
