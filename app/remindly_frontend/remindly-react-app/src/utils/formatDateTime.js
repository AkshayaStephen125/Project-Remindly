 export function formatDateTime(isoString) {
  const cleanIso = isoString.split('+')[0]; 
  const [datePart, timePart] = cleanIso.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = monthNames[parseInt(month, 10) - 1];

  return `${monthName} ${parseInt(day,10)}, ${year}, ${hour}:${minute}:${second}`;
}

export function utcToLocalInput(utcString) {
  if (!utcString) return "";
  const date = new Date(utcString);
  
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}


