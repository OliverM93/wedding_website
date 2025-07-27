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

// Badge für Navbar-Menüpunkt "Anmeldung"
// Zeigt einen Badge an, wenn der Nutzer die Anmeldung noch nicht gesehen hat
// und blendet ihn aus, wenn der Nutzer auf den Link klickt
// Speichert den Status in localStorage, um den Badge nicht erneut anzuzeigen
// wenn die Seite neu geladen wird
document.addEventListener("DOMContentLoaded", function() {
  const navAnmeldung = document.getElementById("nav-anmeldung-link");
  if (!localStorage.getItem("anmeldungHighlightSeen")) {
    navAnmeldung.classList.add("anmeldung-highlight");
    navAnmeldung.addEventListener("click", function() {
      navAnmeldung.classList.remove("anmeldung-highlight");
      localStorage.setItem("anmeldungHighlightSeen", "true");
    });
  }
});

// Dynamische Breite für Select-Elemente
// Passt die Breite von Select-Elementen an den Text der ausgewählten Option an
const measurer = document.getElementById("select-measurer");

  function adjustSelectWidth(select) {
    const selectedText = select.options[select.selectedIndex]?.text || '';
    measurer.textContent = selectedText;

    // Gleiche Font übernehmen für exakte Messung
    const style = getComputedStyle(select);
    measurer.style.font = style.font;
    measurer.style.padding = style.padding;

    // +40px Puffer für Pfeil und Innenabstand
    const newWidth = measurer.offsetWidth + 40;
    select.style.width = newWidth + "px";
  }

  // Initial alle Selects behandeln
  const selects = document.querySelectorAll("select.dynamic-width");

  selects.forEach(select => {
    // Beim Ändern Breite anpassen
    select.addEventListener("change", () => adjustSelectWidth(select));

    // Falls bereits vorausgewählt (z. B. durch Formular-Wiederherstellung)
    if (select.selectedIndex > 0) {
      adjustSelectWidth(select);
    }
  });