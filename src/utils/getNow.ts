export const getNow = () =>
  new Date().toLocaleString("en-US", {
    weekday: "short", // e.g. "Mon"
    year: "numeric", // e.g. "2024"
    month: "short", // e.g. "Sep"
    day: "numeric", // e.g. "22"
    hour: "numeric", // e.g. "2 PM"
    minute: "numeric", // e.g. "15"
    second: "numeric", // e.g. "30"
    hour12: false, // 24h format
  });
