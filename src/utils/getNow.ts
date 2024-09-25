export const getNow = () =>
  new Date().toLocaleString("en-US", {
    weekday: "long", // e.g. "Monday"
    year: "numeric", // e.g. "2024"
    month: "long", // e.g. "September"
    day: "numeric", // e.g. "22"
    hour: "numeric", // e.g. "2 PM"
    minute: "numeric", // e.g. "15"
    second: "numeric", // e.g. "30"
    hour12: false, // 24h format
  });
