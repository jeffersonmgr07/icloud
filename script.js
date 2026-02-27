// ===============================
// CONFIGURACIÓN
// ===============================
// Pega aquí la URL /exec de tu Web App (Apps Script)
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzqmJ8usq5bz2C8cQzln4FxDqZkRl5XRXFzdLUcR8qd4YGWLdzVxCXej02wgzE0R9di/exec";

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
  if (loginModal && typeof loginModal.showModal === "function") {
    loginModal.showModal();
  } else {
    // Fallback si <dialog> no funciona
    window.location.href = "form.html";
  }
}

if (openLoginBtn) openLoginBtn.addEventListener("click", openLoginModal);
if (goLoginIcon) goLoginIcon.addEventListener("click", openLoginModal);

// ===============================
// SUBMIT: GUARDAR + ENVIAR + REDIRIGIR
// ===============================
if (demoLoginForm) {
  demoLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const demoUserEl = document.getElementById("demoUser");
    const demoNickEl = document.getElementById("demoNick");
    const button = document.getElementById("loginSubmit");

    const demoUser = (demoUserEl?.value || "").trim();
    const demoNick = (demoNickEl?.value || "").trim();

    if (!demoUser || !demoNick) return;

    // Activar animación
    if (button) {
      button.classList.add("loading");
      button.disabled = true;
    }

    // Guardar sesión local (demo)
    const session = { demoUser, demoNick, ts: new Date().toISOString() };
    localStorage.setItem("icss_demo_session", JSON.stringify(session));

    // Enviar a Google Sheets
    // (usamos URLSearchParams para evitar preflight CORS)
    try {
      const body = new URLSearchParams({
        demoUser,
        demoNick,
        userAgent: navigator.userAgent
      });

      // Importante: Apps Script puede responder sin CORS, pero igual suele registrar
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body
      });
    } catch (err) {
      console.warn("No se pudo enviar a Google Sheets:", err);
    }

    // Simular carga antes de redirigir (para que se vea el spinner)
    setTimeout(() => {
      if (loginModal && typeof loginModal.close === "function") loginModal.close();
      window.location.href = "form.html";
    }, 900);
  });
}
