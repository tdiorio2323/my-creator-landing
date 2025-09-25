import { test, expect } from '@playwright/test'

test.describe('Public discovery flow', () => {
  test('explore → creator → content (public)', async ({ page }) => {
    await page.goto('/explore')

    const firstCard = page.getByRole('link', { name: /view profile|subscribe|creator/i }).first()
    if (await firstCard.count()) {
      await firstCard.click()
    } else {
      await page.getByText(/explore creators/i)
    }

    await expect(page).toHaveURL(/\/creator\//)
    await page.getByRole('heading', { level: 1 })
    await page.getByText(/Posts|Videos|Photos/, { exact: false }).first()
  })
})
