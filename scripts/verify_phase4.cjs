const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\karti\\.gemini\\antigravity\\brain\\1813bb35-622c-4909-bb43-3e24675382b6';

async function verifyPhase4() {
  console.log('--- Starting AgriCycle Phase 4 Browser Verification ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.log('BROWSER PAGE ERROR:', err.toString());
  });

  // Helper to remove sticky header artifact before fullPage screenshots
  const prepForFullPage = async () => {
    await page.evaluate(() => {
      const header = document.querySelector('header');
      if (header) header.style.position = 'relative';
    });
  };

  try {
    // 1. Visit Login to establish authenticated demo session
    console.log('1. Logging in with Demo Farmer profile...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find((b) => b.textContent.includes('Continue') || b.textContent.includes('Select') || b.textContent.includes('जारी'));
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Current URL after login:', page.url());

    // 2. Ensure active assessment exists by navigating to /recommendation or loading demo
    console.log('2. Ensuring active assessment exists...');
    await page.goto('http://localhost:5173/recommendation', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // 3. Navigate to /compare (Pathway Comparison Matrix)
    console.log('3. Navigating to /compare (Desktop 1280x900)...');
    await page.goto('http://localhost:5173/compare', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    // If needed, load demo assessment
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const loadBtn = buttons.find((b) => b.textContent.includes('Demo') || b.textContent.includes('डेमो'));
      if (loadBtn) loadBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const pageTitle = await page.$eval('h1', (el) => el.textContent);
    console.log('Comparison Page Title:', pageTitle);

    // Capture Desktop Comparison Screenshot
    await prepForFullPage();
    const screenshot1Path = path.join(ARTIFACTS_DIR, 'phase4_01_desktop_compare.png');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    console.log('Saved:', screenshot1Path);

    // 4. Test Hindi Toggle on /compare
    console.log('4. Testing Hindi toggle on /compare...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hiBtn = buttons.find((b) => b.textContent.includes('हिन्दी'));
      if (hiBtn) hiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const screenshot2Path = path.join(ARTIFACTS_DIR, 'phase4_02_compare_hindi.png');
    await page.screenshot({ path: screenshot2Path, fullPage: true });
    console.log('Saved:', screenshot2Path);

    // Switch back to English
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const enBtn = buttons.find((b) => b.textContent.includes('English'));
      if (enBtn) enBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 5. Navigate to /resources (Spatial Machinery & Map)
    console.log('5. Navigating to /resources (Desktop 1280x900)...');
    await page.goto('http://localhost:5173/resources', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2000)); // allow leaflet to render tiles

    // Capture Desktop Resources & Map
    await prepForFullPage();
    const screenshot3Path = path.join(ARTIFACTS_DIR, 'phase4_03_desktop_resources_map.png');
    await page.screenshot({ path: screenshot3Path, fullPage: true });
    console.log('Saved:', screenshot3Path);

    // 6. Test Clicking a Resource marker to view Popup
    console.log('6. Testing Leaflet marker popup...');
    // Reset filters to All to show all regional centers
    await page.evaluate(() => {
      const allBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('All Resources'));
      if (allBtn) allBtn.click();
      const chk = document.querySelector('input[type="checkbox"]');
      if (chk && chk.checked) chk.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click the first resource marker
    const markers = await page.$$('.resource-marker');
    if (markers.length > 0) {
      await markers[0].click();
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Capture open popup
    await prepForFullPage();
    const screenshot4Path = path.join(ARTIFACTS_DIR, 'phase4_04_map_marker_popup.png');
    await page.screenshot({ path: screenshot4Path, fullPage: true });
    console.log('Saved:', screenshot4Path);

    // 7. Test Category Filtering
    console.log('7. Testing Category and Search Filter controls...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chcBtn = buttons.find((b) => b.textContent.trim() === 'CHCs');
      if (chcBtn) chcBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Type in search input
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.type('Happy');
      await new Promise((r) => setTimeout(r, 600));
    }

    await prepForFullPage();
    const screenshot5Path = path.join(ARTIFACTS_DIR, 'phase4_05_resources_filtered.png');
    await page.screenshot({ path: screenshot5Path, fullPage: true });
    console.log('Saved:', screenshot5Path);

    // Reset filters back to default
    await page.evaluate(() => {
      const inp = document.querySelector('input[type="text"]');
      if (inp) {
        inp.value = '';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const resetBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Reset') || b.textContent.includes('रीसेट'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // 8. Test Selecting a Resource
    console.log('8. Testing Resource selection for Action Plan...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const selectBtn = buttons.find((b) => b.textContent.includes('Select Resource') || b.textContent.includes('योजना हेतु चुनें'));
      if (selectBtn) selectBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 9. Tablet Viewport (768x1024)
    console.log('9. Testing Tablet viewport (768x1024)...');
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise((r) => setTimeout(r, 1000));
    await prepForFullPage();
    const screenshot6Path = path.join(ARTIFACTS_DIR, 'phase4_06_tablet_resources.png');
    await page.screenshot({ path: screenshot6Path, fullPage: true });
    console.log('Saved:', screenshot6Path);

    // 10. Mobile Viewport (375x812) for Resources
    console.log('10. Testing Mobile viewport (375x812) on /resources...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise((r) => setTimeout(r, 1000));
    await prepForFullPage();
    const screenshot7Path = path.join(ARTIFACTS_DIR, 'phase4_07_mobile_resources.png');
    await page.screenshot({ path: screenshot7Path, fullPage: true });
    console.log('Saved:', screenshot7Path);

    // 11. Mobile Viewport (375x812) for Compare
    console.log('11. Testing Mobile viewport (375x812) on /compare...');
    await page.goto('http://localhost:5173/compare', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await prepForFullPage();
    const screenshot8Path = path.join(ARTIFACTS_DIR, 'phase4_08_mobile_compare.png');
    await page.screenshot({ path: screenshot8Path, fullPage: true });
    console.log('Saved:', screenshot8Path);

    console.log('--- Verification Completed Successfully! ---');
    console.log('Console Errors count:', consoleErrors.length);
  } catch (err) {
    console.error('Verification failed with error:', err);
  } finally {
    await browser.close();
  }
}

verifyPhase4();
