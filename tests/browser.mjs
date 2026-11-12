// Shared headless-browser launcher for tests and scene captures.
// Uses the Chromium build shipped inside @sparticuz/chromium (no system browser needed).
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
export async function launch() {
  return puppeteer.launch({
    args: [...chromium.args, '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
    executablePath: process.env.CHROME_PATH || (await chromium.executablePath()),
    headless: 'shell',
  });
}
