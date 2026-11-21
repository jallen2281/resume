// Prints dist/index.html to a compact PDF using print styles added in postbuild.
import puppeteer from 'puppeteer';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const browser = await puppeteer.launch({
  args: ['--no-sandbox'],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
});
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('dist/index.html')).href, { waitUntil: 'networkidle0' });
await page.emulateMediaType('print');
await page.pdf({
  path: 'dist/Jared-Allen-Resume.pdf',
  format: 'Letter',
  printBackground: false,
  margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
});
await browser.close();
console.log('pdf: dist/Jared-Allen-Resume.pdf');
