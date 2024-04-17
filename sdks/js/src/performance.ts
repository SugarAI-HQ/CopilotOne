// latencyTracker.ts
import root from "window-or-global";

const tss: number[] = [];
let observer: PerformanceObserver | null = null;

export const addMarker = (stepName: string, timestamps: number[] = tss) => {
  const timestamp = root.performance.now();
  timestamps.push(timestamp);
  PROD: console.log(
    `Step ${stepName} took ${timestamp - timestamps[0]} milliseconds`,
  );
};

export const generateReport = (timestamps: number[]) => {
  addMarker("Tn", timestamps);

  const totalLatency = timestamps[timestamps.length - 1] - timestamps[0];
  console.log(`Total transaction time: ${totalLatency} milliseconds`);
};

export const observePerformance = (timestamps: number[] = tss) => {
  // reset();
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    for (const entry of entries) {
      console.log(`Step ${entry.name} took ${entry.duration} milliseconds`);
      timestamps.push(entry.startTime + entry.duration);
    }
  });
  observer.observe({ entryTypes: ["measure"] });
};

export const reset = (timestamps: number[] = tss) => {
  // Empty tss
  tss.splice(0, tss.length);

  if (observer) {
    observer.disconnect();
    observer = null;
  }
};
