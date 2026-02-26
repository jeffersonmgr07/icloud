// ===============================
// CONFIGURACIÓN
// ===============================
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzOudKnsgrtwqdLpZcW-H8-5yHgOoQQFxDhXJWqh_1vMe1eiisCM8QWFpuzzPVATZBh/exec";

// ===============================
// ELEMENTOS
// ===============================
const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginBtn");
const goLoginIcon = document.getElementById("goLogin");
const demoLoginForm = document.getElementById("demoLoginForm");

// ===============================
// ABRIR MODAL
// ===============================
function openLoginModal() {
  if (loginModal?.showModal) loginModal.showModal();
  else window.location.href = "form.html";
}

openLoginBtn?.addEventListener("click", openLoginModal);
goLoginIcon?.addEventListener("click", openLoginModal);

// ===============================
// ENVÍO DEL FORMULARIO DEMO
// ===============================
demoLoginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const demoUser = document.getElementById("demoUser").value.trim();
  const demoNick = document.getElementById("demoNick").value.trim();

  if (!demoUser || !demoNick) {
    alert("Completa los campos.");
    return;
  }

  // Guardar sesión local (demo)
  const session = { demoUser, demoNick, ts: new Date().toISOString() };
  localStorage.setItem("icss_demo_session", JSON.stringify(session));

  // Enviar a Google Sheets (form-urlencoded para evitar preflight CORS)
  if (SHEETS_ENDPOINT) {
    try {
      const body = new URLSearchParams({
        demoUser,
        demoNick,
        userAgent: navigator.userAgent
      });

      const res = await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body
      });

      console.log("POST enviado. status:", res.status);
    } catch (error) {
      console.warn("No se pudo enviar a Google Sheets:", error);
    }
  }

  loginModal?.close();
  window.location.href = "form.html";
});
