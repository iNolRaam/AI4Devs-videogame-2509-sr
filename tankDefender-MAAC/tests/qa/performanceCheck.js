/**
 * Performance & QA Check for MENU-6
 * 
 * This script measures FPS during the first 10s of Level 1 and monitors console errors.
 * Run this in a browser console or integrate it into the game boot flow.
 */

class PerformanceChecker {
  constructor() {
    this.fpsReadings = [];
    this.consoleErrors = [];
    this.startTime = null;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.checkDuration = 10000; // 10 seconds
    this.animationId = null;
    
    // Capture console errors
    this.originalConsoleError = console.error;
    console.error = (...args) => {
      this.consoleErrors.push({
        timestamp: Date.now(),
        message: args.join(' ')
      });
      this.originalConsoleError.apply(console, args);
    };
  }

  start() {
    this.startTime = performance.now();
    this.measure();
  }

  measure() {
    const now = performance.now();
    const elapsed = now - this.startTime;
    
    if (elapsed >= this.checkDuration) {
      this.stop();
      return;
    }

    // Calculate FPS for this frame
    const delta = now - this.lastTime;
    const fps = 1000 / delta;
    this.fpsReadings.push(fps);
    this.frameCount++;
    this.lastTime = now;

    this.animationId = requestAnimationFrame(() => this.measure());
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Restore original console.error
    console.error = this.originalConsoleError;

    this.generateReport();
  }

  generateReport() {
    const avgFPS = this.fpsReadings.reduce((sum, fps) => sum + fps, 0) / this.fpsReadings.length;
    const minFPS = Math.min(...this.fpsReadings);
    const maxFPS = Math.max(...this.fpsReadings);
    const framesBelow30 = this.fpsReadings.filter(fps => fps < 30).length;
    const percentBelow30 = (framesBelow30 / this.fpsReadings.length) * 100;

    const report = {
      timestamp: new Date().toISOString(),
      duration: this.checkDuration / 1000,
      totalFrames: this.frameCount,
      fps: {
        average: avgFPS.toFixed(2),
        min: minFPS.toFixed(2),
        max: maxFPS.toFixed(2),
        below30Count: framesBelow30,
        below30Percent: percentBelow30.toFixed(2)
      },
      consoleErrors: {
        count: this.consoleErrors.length,
        critical: this.consoleErrors.filter(e => 
          e.message.toLowerCase().includes('error') ||
          e.message.toLowerCase().includes('failed') ||
          e.message.toLowerCase().includes('exception')
        ),
        all: this.consoleErrors
      },
      passed: avgFPS >= 30 && this.consoleErrors.length === 0,
      recommendation: avgFPS >= 30 ? 
        (this.consoleErrors.length === 0 ? 'PASS - All criteria met' : 'REVIEW - Console errors detected') :
        'FAIL - Average FPS below 30'
    };

    console.log('=== MENU-6 Performance & QA Report ===');
    console.log(`Duration: ${report.duration}s`);
    console.log(`Total Frames: ${report.totalFrames}`);
    console.log(`Average FPS: ${report.fps.average}`);
    console.log(`Min FPS: ${report.fps.min}`);
    console.log(`Max FPS: ${report.fps.max}`);
    console.log(`Frames below 30 FPS: ${report.fps.below30Count} (${report.fps.below30Percent}%)`);
    console.log(`Console Errors: ${report.consoleErrors.count}`);
    if (report.consoleErrors.critical.length > 0) {
      console.log('Critical Errors:');
      report.consoleErrors.critical.forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err.message}`);
      });
    }
    console.log(`\nResult: ${report.recommendation}`);
    console.log('=====================================');

    return report;
  }
}

// Export for use in tests or manual QA
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceChecker;
}

// Auto-start if in browser and game is loaded
if (typeof window !== 'undefined' && window.game) {
  console.log('Performance checker ready. Use:');
  console.log('  const checker = new PerformanceChecker();');
  console.log('  checker.start();');
  console.log('Then start the game normally.');
}
