export function formatLocalTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    weekday: "short",     // Fri
    day: "2-digit",       // 01
    month: "short",       // Nov
    year: "numeric",      // 2025
    hour: "2-digit",      
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",   // ✅ Force IST conversion
  });
}
