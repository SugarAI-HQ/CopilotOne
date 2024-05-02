export const createTrackTime = () => {
  // const stats: any[] = [];
  const timestamps: number[] = [];
  const stats = {
    cumulativeTime: {},
    incrementalTime: {},
  };

  // enabble this for array
  // const trackTime = (stepName: string) => {
  //   const currentTimestamp = performance.now();
  //   let incrementalTime = 0;
  //   let cumulativeTime = 0;

  //   if (timestamps.length > 0) {
  //     // Calculate incremental time since the last timestamp
  //     // @ts-ignore
  //     cumulativeTime = currentTimestamp - timestamps[timestamps.length - 1];
  //   }

  //   // Always calculate cumulative time since the first timestamp
  //   incrementalTime = currentTimestamp - (timestamps[0] || currentTimestamp);

  //   timestamps.push(currentTimestamp);
  //   console.log(`Step ${stepName} took ${cumulativeTime} ms incrementally, ${incrementalTime} ms cumulatively`);
  //   stats.push({ name: stepName, cumulativeTime: cumulativeTime, incrementalTime: incrementalTime });

  //   return { cumulativeTime, incrementalTime };
  // };

  // const resetTime = () => {
  //   timestamps.length = 0;
  //   stats.length = 0;
  // };

  const trackTime = (stepName: string) => {
    const currentTimestamp = performance.now();
    let incrementalTime = 0;
    let cumulativeTime = 0;

    if (timestamps.length > 0) {
      // @ts-ignore
      cumulativeTime = currentTimestamp - timestamps[timestamps.length - 1];
    }

    incrementalTime = currentTimestamp - (timestamps[0] || currentTimestamp);
    //@ts-ignore
    stats.cumulativeTime[stepName] = Number(cumulativeTime.toFixed(2));
    //@ts-ignore
    stats.incrementalTime[stepName] = Number(incrementalTime.toFixed(2));

    timestamps.push(currentTimestamp);
    console.log(
      `Step ${stepName} took ${cumulativeTime.toFixed(2)} ms cumulatively, ${incrementalTime.toFixed(2)} ms incrementally`,
    );

    return { cumulativeTime, incrementalTime };
  };

  const resetTime = () => {
    timestamps.length = 0;
    stats.cumulativeTime = {};
    stats.incrementalTime = {};
  };

  return { trackTime, resetTime, getStats: () => stats };
};
