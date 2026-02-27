// ===============================
// CONFIGURACIÓN
// ===============================
// Pega aquí la URL /exec de tu Web App (Apps Script)
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/library/d/1x1Ducy_c69xtugS0ltQapcy9o5q6QhArLjrWt2r5mzfErlckHym0KJPj/2";

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
demoLoginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const demoUser = document.getElementById("demoUser").value.trim();
  const demoNick = document.getElementById("demoNick").value.trim();

  if (!demoUser || !demoNick) {
    alert("Completa los campos.");
    return;
  }

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
