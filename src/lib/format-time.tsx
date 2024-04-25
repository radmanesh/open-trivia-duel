/**
 * Formats milliseconds to minutes and seconds.
 * @param {number} milliseconds The time in milliseconds.
 * @returns {string} The formatted time string (e.g., "5:30" for 5 minutes and 30 seconds).
 */
export function formatTime(milliseconds: number): string {
  // Convert milliseconds to minutes and seconds
  const totalSeconds = Math.floor(milliseconds / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format the time string
  if (minutes === 0) {
    // If minutes is zero, return only seconds
    return `${seconds} secs`;
  } else {
    // If minutes is not zero, return minutes and seconds
    return `${minutes} mins`;
  }
}
