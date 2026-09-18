const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\karti\\.gemini\\antigravity\\brain\\1813bb35-622c-4909-bb43-3e24675382b6';

async function testPopup() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/resources', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  // Reset filters to All to see multiple markers
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('All Resources'));
    if (btn) btn.click();
    const chk = document.querySelector('input[type="checkbox"]');
    if (chk && chk.checked) chk.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Click on the first resource marker using Puppeteer native click
  const markers = await page.$$('.resource-marker');
  console.log(`Found ${markers.length} resource markers`);
  if (markers.length > 0) {
    await markers[0].click();
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Check if .leaflet-popup exists
  const popup = await page.$('.leaflet-popup');
  console.log('Popup visible:', !!popup);

  const screenshotPath = path.join(ARTIFACTS_DIR, 'phase4_04_map_marker_popup.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Saved:', screenshotPath);

  await browser.close();
}

testPopup();
