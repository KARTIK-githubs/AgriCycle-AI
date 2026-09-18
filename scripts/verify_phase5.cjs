const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\karti\\.gemini\\antigravity\\brain\\1813bb35-622c-4909-bb43-3e24675382b6';

async function verifyPhase5() {
  console.log('--- Starting AgriCycle Phase 5 Browser Verification ---');

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
      const target = buttons.find(
        (b) => b.textContent.includes('Continue') || b.textContent.includes('Select') || b.textContent.includes('जारी')
      );
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Current URL after login:', page.url());

    // 2. Ensure active assessment exists by submitting assessment or loading demo
    console.log('2. Setting up active assessment for Taraori, Karnal...');
    await page.goto('http://localhost:5173/assess', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Fill or submit assessment form
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Analyze') || b.textContent.includes('विश्लेषण') || b.textContent.includes('Submit')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 2000)); // wait for analysis animation and recommendation redirect

    // 3. Navigate to /action-plan (Desktop 1280x900)
    console.log('3. Navigating to /action-plan (Desktop 1280x900)...');
    await page.goto('http://localhost:5173/action-plan', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    // If needed, load demo assessment on page
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const loadBtn = buttons.find((b) => b.textContent.includes('Load Demonstration') || b.textContent.includes('डेमो'));
      if (loadBtn) loadBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Interact with checklist steps: mark step 1 as in_progress, step 2 as completed
    console.log('Interacting with checklist step controls...');
    await page.evaluate(() => {
      const selectElements = Array.from(document.querySelectorAll('select'));
      if (selectElements.length >= 2) {
        // Step 1 -> in_progress
        selectElements[0].value = 'in_progress';
        selectElements[0].dispatchEvent(new Event('change', { bubbles: true }));
        // Step 2 -> completed
        selectElements[1].value = 'completed';
        selectElements[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture Desktop Action Plan
    await prepForFullPage();
    const screenshot1Path = path.join(ARTIFACTS_DIR, 'phase5_01_desktop_action_plan.png');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    console.log('Saved:', screenshot1Path);

    // 4. Open "Record Field Outcome" modal on /action-plan
    console.log('4. Opening Record Field Outcome modal dialog...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const recordBtn = buttons.find(
        (b) => b.textContent.includes('Record Field Outcome') || b.textContent.includes('परिणाम दर्ज')
      );
      if (recordBtn) recordBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Fill notes in modal
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = 'Happy Seeder operation executed smoothly from Taraori PACS. 16 tonnes straw mulch retained, clean emergence confirmed.';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    // Capture Modal screenshot
    const screenshot2Path = path.join(ARTIFACTS_DIR, 'phase5_02_action_plan_record_modal.png');
    await page.screenshot({ path: screenshot2Path, fullPage: false });
    console.log('Saved:', screenshot2Path);

    // Submit the modal form to navigate to /impact
    console.log('Submitting outcome record...');
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Save to Impact') || b.textContent.includes('प्रभाव बहीखाते')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Current URL after submitting outcome:', page.url());

    // 5. Verify /impact (Desktop 1280x900)
    console.log('5. Verifying /impact ledger (Desktop 1280x900)...');
    await prepForFullPage();
    const screenshot3Path = path.join(ARTIFACTS_DIR, 'phase5_03_desktop_impact_ledger.png');
    await page.screenshot({ path: screenshot3Path, fullPage: true });
    console.log('Saved:', screenshot3Path);

    // 6. Test Hindi toggle on /impact
    console.log('6. Testing Hindi toggle on /impact...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hiBtn = buttons.find((b) => b.textContent.includes('हिन्दी'));
      if (hiBtn) hiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const screenshot4Path = path.join(ARTIFACTS_DIR, 'phase5_04_impact_hindi.png');
    await page.screenshot({ path: screenshot4Path, fullPage: true });
    console.log('Saved:', screenshot4Path);

    // Switch back to English
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const enBtn = buttons.find((b) => b.textContent.includes('English'));
      if (enBtn) enBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 7. Navigate to /history (Seasonal Audit Trail)
    console.log('7. Navigating to /history (Desktop 1280x900)...');
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    await prepForFullPage();
    const screenshot5Path = path.join(ARTIFACTS_DIR, 'phase5_05_desktop_history.png');
    await page.screenshot({ path: screenshot5Path, fullPage: true });
    console.log('Saved:', screenshot5Path);

    // 8. Tablet Viewport (768x1024) on /action-plan
    console.log('8. Verifying Tablet Viewport (768x1024) on /action-plan...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173/action-plan', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const screenshot6Path = path.join(ARTIFACTS_DIR, 'phase5_06_tablet_action_plan.png');
    await page.screenshot({ path: screenshot6Path, fullPage: true });
    console.log('Saved:', screenshot6Path);

    // 9. Mobile Viewport (375x812) on /impact
    console.log('9. Verifying Mobile Viewport (375x812) on /impact...');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://localhost:5173/impact', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const screenshot7Path = path.join(ARTIFACTS_DIR, 'phase5_07_mobile_impact.png');
    await page.screenshot({ path: screenshot7Path, fullPage: true });
    console.log('Saved:', screenshot7Path);

    // 10. Mobile Viewport (375x812) on /history
    console.log('10. Verifying Mobile Viewport (375x812) on /history...');
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const screenshot8Path = path.join(ARTIFACTS_DIR, 'phase5_08_mobile_history.png');
    await page.screenshot({ path: screenshot8Path, fullPage: true });
    console.log('Saved:', screenshot8Path);

    // 11. Test Reset History and Empty States
    console.log('11. Testing Reset History on /history...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Click reset history button and confirm
    await page.evaluate(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Reset History') || b.textContent.includes('इतिहास रीसेट')
      );
      if (resetBtn) resetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const confirmBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Yes, Clear') || b.textContent.includes('हाँ, मिटाएं')
      );
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Verify empty state is displayed on /history
    await prepForFullPage();
    const screenshot9Path = path.join(ARTIFACTS_DIR, 'phase5_09_history_empty_state.png');
    await page.screenshot({ path: screenshot9Path, fullPage: true });
    console.log('Saved:', screenshot9Path);

    console.log('--- Phase 5 Browser Verification Successfully Completed ---');
    console.log('Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Console error list:', consoleErrors);
    }
  } catch (err) {
    console.error('Verification failed with error:', err);
  } finally {
    await browser.close();
  }
}

verifyPhase5();
