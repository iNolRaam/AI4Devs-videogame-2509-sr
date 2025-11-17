# QA Checklist — MENU-6: Performance & QA Pass

**Task ID:** MENU-6  
**Date:** 2025-11-16  
**Tester:** Automated + Manual verification

---

## Acceptance Criteria

1. **FPS Target:** Average FPS ≥30 during first 10s of Level 1 gameplay
2. **No Critical Console Errors:** Zero critical errors during scene transitions and initial gameplay

---

## Test Environment

- **Browsers:** Chrome (latest), Firefox (latest), Safari (latest)
- **Platform:** Desktop
- **Input:** Keyboard only
- **Scenarios:**
  - Menu → Start (1P) → Level 1
  - Menu → Start (2P) → Level 1
  - Result → Restart → Level 1

---

## Manual Test Steps

### Setup
1. Open `tankDefender-MAAC/demos/menu.html` or launch the game
2. Open browser DevTools (F12)
3. Paste and run the performance checker:
   ```javascript
   // Copy from tests/qa/performanceCheck.js
   const checker = new PerformanceChecker();
   checker.start();
   ```
4. Navigate menu and start game

### Test Case 1: 1P Mode Performance
- [ ] Navigate to Menu
- [ ] Select 1P
- [ ] Press START
- [ ] Wait for 10s performance measurement
- [ ] Verify report shows avg FPS ≥30
- [ ] Verify no critical console errors

### Test Case 2: 2P Mode Performance
- [ ] Navigate to Menu
- [ ] Select 2P
- [ ] Press START
- [ ] Wait for 10s performance measurement
- [ ] Verify report shows avg FPS ≥30
- [ ] Verify no critical console errors

### Test Case 3: Restart Flow
- [ ] Complete a game (Win or Lose)
- [ ] Press Restart on Result screen
- [ ] Run performance checker for 10s
- [ ] Verify avg FPS ≥30
- [ ] Verify no critical console errors

---

## Browser-Specific Checks

### Chrome
- [ ] Stable FPS during initial gameplay
- [ ] No warnings in console
- [ ] Memory usage reasonable (< 200MB initial)

### Firefox
- [ ] Stable FPS during initial gameplay
- [ ] No warnings in console
- [ ] Memory usage reasonable (< 200MB initial)

### Safari
- [ ] Stable FPS during initial gameplay
- [ ] No warnings in console
- [ ] Memory usage reasonable (< 200MB initial)

---

## Performance Profiler (Optional Deep Dive)

For detailed analysis:
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Navigate Menu → Start → play 10s
4. Stop recording
5. Check:
   - Frame rate graph (should be mostly green, ≥30 FPS)
   - Long tasks (should be minimal)
   - Main thread activity (no blocking >100ms)

---

## Results Template

```
Browser: [Chrome/Firefox/Safari]
Mode: [1P/2P]
Average FPS: [X.XX]
Min FPS: [X.XX]
Frames below 30: [X] ([X%])
Console Errors: [count]
Critical Errors: [list or "None"]
Result: [PASS/FAIL]
Notes: [any observations]
```

---

## Pass Criteria

✅ **PASS** if:
- Average FPS ≥30 in all browsers and modes
- Zero critical console errors
- No visible stuttering or freezing

❌ **FAIL** if:
- Average FPS <30 in any scenario
- Critical console errors present
- Noticeable performance degradation

---

## Notes

- If FPS is below target, profile with Chrome DevTools to identify bottlenecks
- Common issues: excessive DOM updates, inefficient physics loops, memory leaks
- Refer to `techContext.md` for performance optimization strategies
