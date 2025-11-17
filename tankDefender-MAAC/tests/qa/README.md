# QA Testing for MENU-6

This directory contains performance and quality assurance tools for MENU-6 (Performance & QA Pass).

## Files

- **`performanceCheck.js`** - FPS measurement and console error monitoring utility
- **`MENU-6-checklist.md`** - Manual QA checklist for browser testing
- **`menu6-qa.test.js`** - Automated test suite (requires browser environment)

## Quick Start

### Manual Testing (Recommended for MENU-6)

1. **Open the game in a browser:**
   ```bash
   # If you have a local server running
   open http://localhost:8080/demos/menu.html
   
   # Or open the HTML file directly
   open tankDefender-MAAC/demos/menu.html
   ```

2. **Open browser DevTools (F12)**

3. **Paste the performance checker script:**
   ```javascript
   // Copy entire content from performanceCheck.js
   // Or use this shortcut if available:
   const checker = new PerformanceChecker();
   checker.start();
   ```

4. **Navigate and play:**
   - Select 1P or 2P
   - Press START
   - Play for 10 seconds
   - Check the console output

5. **Review the report:**
   ```
   === MENU-6 Performance & QA Report ===
   Duration: 10s
   Average FPS: XX.XX
   Console Errors: X
   Result: PASS/FAIL
   =====================================
   ```

### Automated Testing (Future Enhancement)

For headless browser testing with Puppeteer/Playwright:

```bash
# Install dependencies
npm install --save-dev puppeteer

# Run automated tests
npm test -- tests/qa/menu6-qa.test.js
```

## Acceptance Criteria

✅ **Pass Conditions:**
- Average FPS ≥30 during first 10s of Level 1
- Zero critical console errors
- Smooth scene transitions (Menu → Game → Result)

❌ **Fail Conditions:**
- Average FPS <30
- Critical console errors present
- Visible stuttering or freezing

## Browser Coverage

Test in all supported browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Not Supported (out of scope):**
- ❌ Edge
- ❌ Mobile browsers

## Troubleshooting

### Low FPS Issues
1. Check Chrome DevTools → Performance tab
2. Look for:
   - Long tasks (>50ms)
   - Excessive DOM updates
   - Memory leaks
3. Profile Phaser scene rendering
4. Check physics update frequency

### Console Errors
- Review error messages in the report
- Check for:
  - Asset loading failures
  - Physics configuration issues
  - Scene transition bugs
- Fix errors and re-run tests

## Integration with CI/CD

To integrate with automated testing pipeline:

```bash
# Add to package.json scripts
"test:qa": "node tests/qa/menu6-qa.test.js",
"test:perf": "node tests/qa/performanceCheck.js"
```

Future enhancement: Add Puppeteer-based E2E tests for automated QA runs.

## Results Tracking

Document results in the checklist (`MENU-6-checklist.md`) with:
- Date/time of test
- Browser and version
- FPS measurements
- Any errors or issues found
- Pass/fail status

---

**Last Updated:** 2025-11-16  
**Related Task:** MENU-6 (menu-1p-2p-start/tasks.md)
