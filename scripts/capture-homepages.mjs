#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const dataPath = path.resolve('../resources/js/data/portfolioItems.json');
const outDir = path.resolve('../storage/app/public/og-cache');

// Get environment from command line args or default to 'production'
const env = process.argv[2] || 'production';

const getEnvironmentUrl = (url, environment) => {
  if (environment === 'local') {
    return url.replace(/\.com/g, '.local');
  }
  // Add other environments as needed
  return url;
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  for (const item of items) {
    try {
      const page = await context.newPage();
      const url = getEnvironmentUrl(item.url, env);
      console.log('Capturing', url);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

      // Attempt to click away cookie banners or overlays by pressing Escape
      await page.keyboard.press('Escape').catch(() => {});

      const safeName = url.replace(/https?:\/\//, '').replace(/[\\/:*?"<>|]/g, '_');
      const outFile = path.join(outDir, `${safeName}.png`);

      await page.screenshot({ path: outFile, type: 'png', fullPage: false });
      console.log('Saved', outFile);
      await page.close();
    } catch (e) {
      console.error('Failed to capture', item.url, e.message || e);
    }
  }
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
