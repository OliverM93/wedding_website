//Kontaktformular erweitern
const textarea = document.getElementById("nachricht");
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

// Countdown Timer
function updateCountdown() {
  const eventDate = new Date("2026-07-25T12:00:00");
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "Heute ist unser großer Tag!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));


  document.getElementById("countdown").innerHTML =
    `Noch <span class="count-num">${days}</span> Tage `;

}

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // dynamische Sektionstrenner
function revealDividers() {
  document.querySelectorAll('.section-divider').forEach(divider => {
    const rect = divider.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      divider.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealDividers);
window.addEventListener('load', revealDividers);

