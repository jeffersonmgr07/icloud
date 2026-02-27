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
  if (loginModal?.showModal) loginModal.showModal();
  else window.location.href = "form.html";
}

openLoginBtn?.addEventListener("click", openLoginModal);
goLoginIcon?.addEventListener("click", openLoginModal);

// ===============================
// SUBMIT: GUARDAR + ENVIAR + REDIRIGIR
// ===============================
demoLoginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const demoUser = document.getElementById("demoUser").value.trim();
  const demoNick = document.getElementById("demoNick").value.trim();
  const button = document.getElementById("loginSubmit");

  if (!demoUser || !demoNick) return;

  // Activar animación
  button.classList.add("loading");
  button.disabled = true;

  // Simular carga (1.3 segundos)
  setTimeout(() => {

    const session = { demoUser, demoNick, ts: Date.now() };
    localStorage.setItem("icss_demo_session", JSON.stringify(session));

    window.location.href = "form.html";

  }, 1300);
});

  // 1) Guardar sesión local (demo)
  const session = { demoUser, demoNick, ts: new Date().toISOString() };
  localStorage.setItem("icss_demo_session", JSON.stringify(session));

  // 2) Enviar a Google Sheets (SIN JSON para evitar CORS preflight)
  //    En Apps Script, esto se recibe como e.parameter
  try {
    const body = new URLSearchParams({
      demoUser,
      demoNick,
      userAgent: navigator.userAgent
    });

    // Nota: aunque la respuesta pueda estar limitada por CORS,
    // igual se registra en Sheets si el POST llegó.
    const res = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      body
    });

    console.log("POST enviado. status:", res.status);
  } catch (err) {
    console.warn("No se pudo enviar a Google Sheets:", err);
  }

  // 3) Cerrar y redirigir
  loginModal?.close();
  window.location.href = "form.html";
});
