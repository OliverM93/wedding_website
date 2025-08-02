document.addEventListener('DOMContentLoaded', () => {
  const ts = Math.floor(Date.now() / 1000);
  const formStart = document.querySelector('input[name="form_start"]');
  if (formStart) formStart.value = ts;

  const textarea = document.getElementById("nachricht");
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
  textarea.style.height = `${textarea.scrollHeight}px`;

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

  const navAnmeldung = document.getElementById("nav-anmeldung-link");
  if (!localStorage.getItem("anmeldungHighlightSeen")) {
    navAnmeldung.classList.add("anmeldung-highlight");
    navAnmeldung.addEventListener("click", () => {
      navAnmeldung.classList.remove("anmeldung-highlight");
      localStorage.setItem("anmeldungHighlightSeen", "true");
    });
  }

  const measurer = document.getElementById("select-measurer");
  const adjustSelectWidth = (select) => {
    const selectedText = select.options[select.selectedIndex]?.text || '';
    measurer.textContent = selectedText;
    const style = getComputedStyle(select);
    measurer.style.font = style.font;
    measurer.style.padding = style.padding;
    const newWidth = measurer.offsetWidth + 40;
    select.style.width = `${newWidth}px`;
  };
  const selects = document.querySelectorAll("select.dynamic-width");
  selects.forEach(select => {
    select.addEventListener("change", () => adjustSelectWidth(select));
    if (select.selectedIndex > 0) adjustSelectWidth(select);
  });

  const form = document.getElementById('anmeldeformular');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      showToast(result.success ? "Danke für deine Anmeldung!" : `Fehler: ${result.error || 'Unbekannter Fehler'}`, result.success ? "success" : "error");
      if (result.success) form.reset();
    } catch (error) {
      showToast("Fehler bei der Übermittlung. Bitte versuche es später erneut.", "error");
    }
  });

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show', 'success', 'error'), 3500);
  }

  function updateCountdown() {
    const eventDate = new Date("2026-07-25T00:00:00");
    const now = new Date();
    const diff = eventDate - now;
    const countdownElement = document.getElementById("countdown");
    if (diff <= 0) {
      countdownElement.textContent = "Heute ist unser großer Tag!";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownElement.innerHTML = `Noch <span class="count-num">${days}</span> Tage `;
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();
});