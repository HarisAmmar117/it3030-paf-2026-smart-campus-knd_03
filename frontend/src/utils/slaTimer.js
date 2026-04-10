export function parseApiDateTime(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDuration(startValue, endValue) {
  const start = parseApiDateTime(startValue);
  const end = parseApiDateTime(endValue);

  if (!start || !end) return "-";

  let diffSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (diffSeconds < 0) diffSeconds = 0;

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getSlaStatusLabel(ticket) {
  if (ticket.firstResponseAt) return "Responded";
  return "Awaiting first response";
}
