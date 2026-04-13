/**
 * Time utilities for converting birth data into Julian Day numbers
 * required by the Swiss Ephemeris.
 */

/**
 * Convert a date and time string to a Julian Day number.
 * This is the standard astronomical time format used by Swiss Ephemeris.
 *
 * @param date ISO date string: YYYY-MM-DD
 * @param time 24-hour time string: HH:MM
 * @returns Julian Day number (UT)
 */
export function toJulianDay(date: string, time: string): number {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const decimalHours = hours + minutes / 60;

  // Julian Day calculation (Meeus, Astronomical Algorithms)
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    decimalHours / 24 +
    B -
    1524.5;

  return JD;
}

/**
 * Get the sidereal time at Greenwich for a given Julian Day.
 * Used for house calculations.
 */
export function greenwichSiderealTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  let gst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  gst = ((gst % 360) + 360) % 360;
  return gst;
}
