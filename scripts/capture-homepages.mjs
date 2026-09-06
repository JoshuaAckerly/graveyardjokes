#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonDataPath = path.resolve(__dirname, '../resources/js/data/portfolioItems.json');
const tsDataPath = path.resolve(__dirname, '../resources/js/data/portfolioItems.ts');
const outDir = path.resolve(__dirname, '../storage/app/public/og-cache');

// Get environment from command line args or default to 'production'
const env = process.argv[2] || 'production';

const getBaseDomain = (environment) => {
  if (environment === 'local') return 'graveyardjokes.local';
  if (environment === 'test' || environment === 'testing') return 'graveyardjokes.test';
  return 'graveyardjokes.com';
};

const getEnvironmentUrl = (url, environment) => {
  const baseDomainPattern = /graveyardjokes\.(com|local|test)/g;
  return url.replace(baseDomainPattern, getBaseDomain(environment));
};

const loadItems = () => {
  // portfolioItems.json is a legacy, git-ignored mirror — parse the real source of truth instead.
  if (fs.existsSync(tsDataPath)) {
    const tsContent = fs.readFileSync(tsDataPath, 'utf8');
    const items = [];

    // Match `getProjectUrl('subdomain')` and plain string `url: '...'` / `url: "..."` values.
    const urlPattern = /url:\s*(?:getProjectUrl\('([^']+)'\)|'([^']+)'|"([^"]+)")/g;
    for (const match of tsContent.matchAll(urlPattern)) {
      const [, subdomain, singleQuoted, doubleQuoted] = match;
      const url = subdomain ? `http://${subdomain}.${getBaseDomain(env)}` : (singleQuoted ?? doubleQuoted);
      items.push({ title: subdomain ?? url, url });
    }

    if (!items.length) {
      throw new Error(`No project URLs found in ${tsDataPath}`);
    }

    return items;
  }

  if (fs.existsSync(jsonDataPath)) {
    return JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));
  }

  throw new Error(`Could not find portfolio data file at ${tsDataPath} or ${jsonDataPath}`);
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const items = loadItems();

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
