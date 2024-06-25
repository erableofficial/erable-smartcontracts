export function approximateTime(seconds: number): string {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  if (seconds < minute) {
    return `${seconds} seconds`;
  } else if (seconds < hour) {
    return `${Math.round(seconds / minute)} minutes`;
  } else if (seconds < day) {
    return `${Math.round(seconds / hour)} hours`;
  } else if (seconds < year) {
    return `${Math.round(seconds / day)} days`;
  } else {
    return `${Math.round(seconds / year)} years`;
  }
}
