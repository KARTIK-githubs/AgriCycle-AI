const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\karti\\.gemini\\antigravity\\brain\\1813bb35-622c-4909-bb43-3e24675382b6';

async function runFinalQA() {
  console.log('===========================================================');
  console.log('  AGRICYCLE — PHASE 6 FINAL INTEGRATION & QA VERIFICATION  ');
  console.log('===========================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.log('  [BROWSER ERROR]:', text);
    } else if (msg.type() === 'warning') {
      // Filter out Leaflet tile load network warnings if any
      if (!text.includes('tile.openstreetmap.org')) {
        consoleWarnings.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.log('  [BROWSER PAGE ERROR]:', err.toString());
  });

  // Helper to remove sticky header artifact before fullPage screenshots
  const prepForFullPage = async () => {
    await page.evaluate(() => {
      const header = document.querySelector('header');
      if (header) header.style.position = 'relative';
    });
  };

  try {
    // -------------------------------------------------------------
    // STEP 1: LANDING PAGE (Desktop 1280x900)
    // -------------------------------------------------------------
    console.log('\n[1/19] Testing Landing Page (/)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    await prepForFullPage();
    const sc1 = path.join(ARTIFACTS_DIR, 'final_01_landing.png');
    await page.screenshot({ path: sc1, fullPage: true });
    console.log('  Saved:', sc1);

    // -------------------------------------------------------------
    // STEP 2: DEMO LOGIN
    // -------------------------------------------------------------
    console.log('\n[2/19] Testing Demo Access Flow (/login)...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    await prepForFullPage();
    const sc2 = path.join(ARTIFACTS_DIR, 'final_02_login.png');
    await page.screenshot({ path: sc2, fullPage: true });
    console.log('  Saved:', sc2);

    // Select canonical profile: Gurpreet Singh (Karnal, Haryana)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find((b) => b.textContent.includes('Continue') || b.textContent.includes('Select') || b.textContent.includes('जारी'));
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log('  Logged in! Current URL:', page.url());

    // -------------------------------------------------------------
    // STEP 3: FARMER HOME
    // -------------------------------------------------------------
    console.log('\n[3/19] Testing Farmer Home (/home)...');
    await page.goto('http://localhost:5173/home', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    await prepForFullPage();
    const sc3 = path.join(ARTIFACTS_DIR, 'final_03_home.png');
    await page.screenshot({ path: sc3, fullPage: true });
    console.log('  Saved:', sc3);

    // -------------------------------------------------------------
    // STEP 4: RESIDUE ASSESSMENT FORM
    // -------------------------------------------------------------
    console.log('\n[4/19] Testing Residue Assessment (/assess)...');
    await page.goto('http://localhost:5173/assess', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Fill canonical scenario: Paddy, 8 acres, 5 tonnes, Karnal, 12 days, None, Lowest Cost
    await page.evaluate(() => {
      // Set residue tonnes to 5.0
      const inputs = Array.from(document.querySelectorAll('input'));
      const residueInput = inputs.find((i) => i.name === 'residueTonnes' || i.id?.includes('residue') || i.value === '5' || i.value === '5.0');
      if (residueInput) {
        residueInput.value = '5.0';
        residueInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    await prepForFullPage();
    const sc4 = path.join(ARTIFACTS_DIR, 'final_04_assessment.png');
    await page.screenshot({ path: sc4, fullPage: true });
    console.log('  Saved:', sc4);

    // Submit form -> triggers analysis animation
    console.log('  Submitting assessment to Solver...');
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Analyze') || b.textContent.includes('विश्लेषण') || b.textContent.includes('Submit')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 2200)); // wait for analysis page and redirect to recommendation
    console.log('  Current URL after analysis redirect:', page.url());

    // -------------------------------------------------------------
    // STEP 5: RECOMMENDATION PAGE
    // -------------------------------------------------------------
    console.log('\n[5/19] Verifying Recommendation (/recommendation)...');
    await prepForFullPage();
    const sc5 = path.join(ARTIFACTS_DIR, 'final_05_recommendation.png');
    await page.screenshot({ path: sc5, fullPage: true });
    console.log('  Saved:', sc5);

    // -------------------------------------------------------------
    // STEP 6: PATHWAY COMPARISON MATRIX
    // -------------------------------------------------------------
    console.log('\n[6/19] Verifying Pathway Comparison Matrix (/compare)...');
    await page.goto('http://localhost:5173/compare', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    await prepForFullPage();
    const sc6 = path.join(ARTIFACTS_DIR, 'final_06_compare.png');
    await page.screenshot({ path: sc6, fullPage: true });
    console.log('  Saved:', sc6);

    // -------------------------------------------------------------
    // STEP 7: NEARBY RESOURCES & LEAFLET MAP
    // -------------------------------------------------------------
    console.log('\n[7/19] Verifying Nearby Resources Directory & Map (/resources)...');
    await page.goto('http://localhost:5173/resources', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2000)); // allow leaflet to render tiles

    // Select first resource to connect it to the session
    await page.evaluate(() => {
      const selectBtns = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent.includes('Select Resource') || b.textContent.includes('चुनें'));
      if (selectBtns.length > 0) selectBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await prepForFullPage();
    const sc7 = path.join(ARTIFACTS_DIR, 'final_07_resources.png');
    await page.screenshot({ path: sc7, fullPage: true });
    console.log('  Saved:', sc7);

    // -------------------------------------------------------------
    // STEP 8: ACTION PLAN CHECKLIST
    // -------------------------------------------------------------
    console.log('\n[8/19] Verifying Field Action Plan (/action-plan)...');
    await page.goto('http://localhost:5173/action-plan', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Interact with checklist steps: mark step 1 in-progress, step 2 completed
    await page.evaluate(() => {
      const selectElements = Array.from(document.querySelectorAll('select'));
      if (selectElements.length >= 2) {
        selectElements[0].value = 'in_progress';
        selectElements[0].dispatchEvent(new Event('change', { bubbles: true }));
        selectElements[1].value = 'completed';
        selectElements[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 600));

    await prepForFullPage();
    const sc8 = path.join(ARTIFACTS_DIR, 'final_08_action_plan.png');
    await page.screenshot({ path: sc8, fullPage: true });
    console.log('  Saved:', sc8);

    // -------------------------------------------------------------
    // STEP 9: RECORD FIELD OUTCOME MODAL
    // -------------------------------------------------------------
    console.log('\n[9/19] Verifying Record Field Outcome Modal...');
    await page.evaluate(() => {
      const recordBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Record Field Outcome') || b.textContent.includes('Record Outcome Now') || b.textContent.includes('परिणाम दर्ज')
      );
      if (recordBtn) recordBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Enter notes in modal
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = 'In-situ Happy Seeder operation executed smoothly from Taraori PACS. 5.0 tonnes straw mulch retained, clean emergence confirmed.';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    const sc9 = path.join(ARTIFACTS_DIR, 'final_09_outcome_modal.png');
    await page.screenshot({ path: sc9, fullPage: false });
    console.log('  Saved:', sc9);

    // Submit outcome record
    console.log('  Submitting field outcome record...');
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.includes('Save to Impact') || b.textContent.includes('प्रभाव बहीखाते')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('  Current URL after recording outcome:', page.url());

    // -------------------------------------------------------------
    // STEP 10: GROUNDED IMPACT LEDGER
    // -------------------------------------------------------------
    console.log('\n[10/19] Verifying Impact Ledger (/impact)...');
    await prepForFullPage();
    const sc10 = path.join(ARTIFACTS_DIR, 'final_10_impact.png');
    await page.screenshot({ path: sc10, fullPage: true });
    console.log('  Saved:', sc10);

    // -------------------------------------------------------------
    // STEP 11: SEASONAL HISTORY
    // -------------------------------------------------------------
    console.log('\n[11/19] Verifying Seasonal Assessment History (/history)...');
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc11 = path.join(ARTIFACTS_DIR, 'final_11_history.png');
    await page.screenshot({ path: sc11, fullPage: true });
    console.log('  Saved:', sc11);

    // -------------------------------------------------------------
    // STEP 12 & 13: BILINGUAL HINDI JOURNEY
    // -------------------------------------------------------------
    console.log('\n[12/19] Testing Hindi Language Switch on /impact...');
    await page.goto('http://localhost:5173/impact', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hiBtn = buttons.find((b) => b.textContent.includes('हिन्दी'));
      if (hiBtn) hiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc12 = path.join(ARTIFACTS_DIR, 'final_12_hindi_impact.png');
    await page.screenshot({ path: sc12, fullPage: true });
    console.log('  Saved:', sc12);

    console.log('\n[13/19] Verifying Hindi on /history...');
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc13 = path.join(ARTIFACTS_DIR, 'final_13_hindi_history.png');
    await page.screenshot({ path: sc13, fullPage: true });
    console.log('  Saved:', sc13);

    // Switch back to English
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const enBtn = buttons.find((b) => b.textContent.includes('English'));
      if (enBtn) enBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // -------------------------------------------------------------
    // STEP 14 & 15: TABLET VIEWPORT (768x1024)
    // -------------------------------------------------------------
    console.log('\n[14/19] Testing Tablet Viewport (768x1024) on /compare...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173/compare', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc14 = path.join(ARTIFACTS_DIR, 'final_14_tablet_compare.png');
    await page.screenshot({ path: sc14, fullPage: true });
    console.log('  Saved:', sc14);

    console.log('\n[15/19] Testing Tablet Viewport on /action-plan...');
    await page.goto('http://localhost:5173/action-plan', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc15 = path.join(ARTIFACTS_DIR, 'final_15_tablet_action_plan.png');
    await page.screenshot({ path: sc15, fullPage: true });
    console.log('  Saved:', sc15);

    // -------------------------------------------------------------
    // STEP 16, 17, 18: MOBILE VIEWPORT (375x812)
    // -------------------------------------------------------------
    console.log('\n[16/19] Testing Mobile Viewport (375x812) on /recommendation...');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://localhost:5173/recommendation', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc16 = path.join(ARTIFACTS_DIR, 'final_16_mobile_recommendation.png');
    await page.screenshot({ path: sc16, fullPage: true });
    console.log('  Saved:', sc16);

    console.log('\n[17/19] Testing Mobile Viewport on /impact...');
    await page.goto('http://localhost:5173/impact', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc17 = path.join(ARTIFACTS_DIR, 'final_17_mobile_impact.png');
    await page.screenshot({ path: sc17, fullPage: true });
    console.log('  Saved:', sc17);

    console.log('\n[18/19] Testing Mobile Viewport on /history...');
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    await prepForFullPage();
    const sc18 = path.join(ARTIFACTS_DIR, 'final_18_mobile_history.png');
    await page.screenshot({ path: sc18, fullPage: true });
    console.log('  Saved:', sc18);

    // -------------------------------------------------------------
    // STEP 19: DEMO RESET & EMPTY STATE TEST
    // -------------------------------------------------------------
    console.log('\n[19/19] Testing Demo Reset & Empty State...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Trigger clear history
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

    await prepForFullPage();
    const sc19 = path.join(ARTIFACTS_DIR, 'final_19_reset_empty_state.png');
    await page.screenshot({ path: sc19, fullPage: true });
    console.log('  Saved:', sc19);

    console.log('\n===========================================================');
    console.log('  FINAL QA VERIFICATION COMPLETE');
    console.log('===========================================================');
    console.log('Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
  } catch (err) {
    console.error('Fatal Verification Error:', err);
  } finally {
    await browser.close();
  }
}

runFinalQA();
