import { expect, test, type Page } from '@playwright/test'

const PDP_URL =
  'https://www.zalando.es/guess-elba-zapatillas-beigebrown-gu112o0bw-b11.html'
const API = process.env.E2E_API_BASE_URL ?? 'http://localhost:3000'

async function dismissCookies(page: Page) {
  const accept = page.getByRole('button', { name: 'Aceptar' })
  if (await accept.isVisible().catch(() => false)) {
    await accept.click({ force: true })
  }
}

async function setupUrlAndAreas(page: Page) {
  await page.goto('/tech/assessment')
  await dismissCookies(page)
  await expect(page.getByRole('heading', { name: /ecommerce por dentro/i })).toBeVisible()

  const urlInput = page.getByPlaceholder(/tutienda\.com\/producto/i)
  await urlInput.fill(PDP_URL)

  // Select PIM + DAM
  await page.getByRole('button', { name: /PIM & Atributos/i }).click({ force: true })
  await page.getByRole('button', { name: /DAM & Documentos/i }).click({ force: true })

  const continueSetup = page.getByRole('button', { name: /Continuar/i })
  await expect(continueSetup).toBeEnabled()
  await continueSetup.click({ force: true })
  await expect(page.getByRole('heading', { name: /tipo de revisión/i })).toBeVisible()
}

async function chooseReviewType(page: Page, type: 'instant' | 'detailed') {
  const pill = type === 'instant' ? 'Sin formulario' : 'Incluye formulario y email'
  // Prefer the type card (pill text is unique); dispatchEvent avoids sticky-nav intercepts.
  const card = page.locator('main button').filter({ hasText: pill }).first()
  await expect(card).toBeVisible()
  await card.dispatchEvent('click')
  const start = page.getByRole('button', { name: /Iniciar diagnóstico/i })
  await expect(start).toBeEnabled({ timeout: 10_000 })
  await start.click({ force: true })
}

test.describe('Assessment both review types', () => {
  test('instant review: analyze → results → email → confirm', async ({ page }) => {
    await setupUrlAndAreas(page)

    await chooseReviewType(page, 'instant')

    await expect(page.getByText(/\/100/)).toBeVisible({ timeout: 90_000 })
    await expect(page.getByText(/Zalando|guess|ELBA/i).first()).toBeVisible()

    await page
      .getByRole('button', { name: /Dejar email y solicitar informe/i })
      .click({ force: true })

    await expect(page.getByPlaceholder('tu@empresa.com')).toBeVisible({ timeout: 15_000 })

    const stamp = Date.now()
    await page.getByPlaceholder('tu@empresa.com').fill(`instant-${stamp}@example.com`)
    await page.locator('input[type=checkbox]').check({ force: true })
    await page.getByRole('button', { name: 'Solicitar informe' }).click({ force: true })

    await expect(page.getByRole('heading', { name: 'Solicitud recibida' })).toBeVisible({
      timeout: 45_000,
    })
  })

  test('detailed review: questions → email form → confirm', async ({ page }) => {
    await setupUrlAndAreas(page)

    await chooseReviewType(page, 'detailed')

    await expect(page.getByRole('heading', { name: 'Preguntas por área' })).toBeVisible({
      timeout: 15_000,
    })

    // Answer all pim (3) + dam (3) questions with first option via native click
    const firstAnswers = [
      'Menos de 500',
      'Sí, estándar definido y aplicado',
      'Sí, modelados por familia de producto',
      'Sí, centralizado y accesible',
      'Sí, vinculados al registro de producto en el PIM',
      'Sí, enlazados directamente en la PDP',
    ]
    for (const label of firstAnswers) {
      const btn = page.getByRole('button', { name: label })
      await btn.scrollIntoViewIfNeeded()
      await btn.evaluate((el: HTMLElement) => el.click())
    }

    await page.getByRole('button', { name: 'Continuar →' }).evaluate((el: HTMLElement) => el.click())
    await expect(
      page.getByRole('heading', { name: /Datos para el informe detallado|enviamos el informe/i }),
    ).toBeVisible({ timeout: 15_000 })

    const stamp = Date.now()
    const form = page.locator('main')
    await form.getByPlaceholder('Tu nombre').fill('Detalle Test')
    await form.getByPlaceholder('Empresa', { exact: true }).fill('Detalle Co')
    await form.getByPlaceholder('tu@empresa.com').fill(`detailed-${stamp}@example.com`)
    await form.locator('input[type=checkbox]').evaluate((el: HTMLInputElement) => {
      el.checked = true
      el.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await form.getByRole('button', { name: 'Solicitar informe' }).click({ force: true })

    await expect(page.getByRole('heading', { name: 'Solicitud recibida' })).toBeVisible({
      timeout: 60_000,
    })
  })
})

async function adminListAssessments(request: import('@playwright/test').APIRequestContext) {
  const password = process.env.ADMIN_SEED_PASSWORD
  if (!password) throw new Error('ADMIN_SEED_PASSWORD env required')

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 4000 * attempt))
    const login = await request.post(`${API}/api/auth/login`, {
      data: {
        email: process.env.ADMIN_SEED_EMAIL ?? 'demo@lumify.es',
        password,
      },
    })
    if (login.status() === 429) continue
    if (login.status() !== 201) {
      throw new Error(`login ${login.status()} ${await login.text()}`)
    }
    const { access_token } = (await login.json()) as { access_token: string }
    const list = await request.get(
      `${API}/api/admin/leads/inquiries?archived=false&deleted=false&page=1&limit=50&sortBy=createdAt&sortDir=desc`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    )
    if (list.status() === 429) continue
    if (list.status() !== 200) {
      throw new Error(`list ${list.status()} ${await list.text()}`)
    }
    return list.json() as Promise<{
      items: Array<{
        interestType: string
        analysis?: {
          reviewType?: string
          globalScore?: number
          screenshots?: unknown[]
          answers?: Record<string, number>
        }
        email: string
      }>
    }>
  }
  throw new Error('admin API throttled after retries')
}

test('admin API has both ecommerce assessment leads', async ({ request }) => {
  const body = await adminListAssessments(request)
  const assessments = (body.items || []).filter((i) => i.interestType === 'ecommerce_assessment')
  expect(assessments.length).toBeGreaterThanOrEqual(2)

  const instant = assessments.find((i) => i.analysis?.reviewType === 'instant')
  const detailed = assessments.find((i) => i.analysis?.reviewType === 'detailed')
  expect(instant, 'instant lead').toBeTruthy()
  expect(detailed, 'detailed lead').toBeTruthy()
  expect(instant!.analysis!.globalScore).toBeGreaterThan(0)
  expect((instant!.analysis!.screenshots || []).length).toBeGreaterThanOrEqual(1)
  expect(
    detailed!.analysis!.answers && Object.keys(detailed!.analysis!.answers).length,
  ).toBeGreaterThan(0)
})
