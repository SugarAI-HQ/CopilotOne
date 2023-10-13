export function getRandomValue(min: number, max: number): number {
  // Check if the provided range is valid
  if (min >= max) {
    throw new Error("Invalid range. 'min' must be less than 'max'.");
  }

  // Generate a random decimal number between 0 (inclusive) and 1 (exclusive)
  const randomDecimal = Math.random();

  // Scale the random decimal to the range [min, max]
  const randomValue = min + randomDecimal * (max - min);

  // Use Math.floor to ensure the result is an integer
  return Math.floor(randomValue);
}

// Example usage: Generate a random number between 2 and 7 (inclusive of 2, exclusive of 7)
const randomValue = getRandomValue(2, 7);
console.log(randomValue); // This will print a random number between 2 and 6
