// Simple script just to set the year
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
});
