import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: /Welcome to CaribX/i })).toBeVisible();
    
    // Check for description
    await expect(page.getByText(/Blockchain Money Transfer/i)).toBeVisible();
    
    // Check for navigation buttons
    await expect(page.getByRole('link', { name: /Browse Marketplace/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /My Wallet/i })).toBeVisible();
  });

  test('should navigate to marketplace', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /Browse Marketplace/i }).click();
    
    // Wait for navigation
    await page.waitForURL('/marketplace');
    
    // Verify we're on the marketplace page
    expect(page.url()).toContain('/marketplace');
  });

  test('should navigate to wallet', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /My Wallet/i }).click();
    
    // Wait for navigation
    await page.waitForURL('/wallet');
    
    // Verify we're on the wallet page
    expect(page.url()).toContain('/wallet');
  });
});
