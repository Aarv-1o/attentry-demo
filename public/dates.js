export function formatDate(value) {
  const date = new Date(value);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Nothing uses this any more.
export function daysAgo(value) {
  return Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
}
