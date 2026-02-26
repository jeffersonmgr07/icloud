// === CONFIG ===
// 1) Si quieres loguear "evento de login demo" en Sheets, pega tu endpoint aquí.
//    Si lo dejas vacío, NO enviará nada y solo redirige.
const LOGIN_SHEETS_ENDPOINT = ""; // ej: "https://script.google.com/macros/s/XXXX/exec"

const loginModal = document.getElementById("loginModal");
const goLoginIcon = document.getElementById("goLogin");
const openLoginBtn = document.querySelector(".btn-primary"); // tu botón "Iniciar sesión ›"
const demoLoginForm = document.getElementById("demoLoginForm");

function openLoginModal(e){
  e?.preventDefault?.();
  if (loginModal?.showModal) loginModal.showModal();
  else window.location.href = "form.html"; // fallback
}

goLoginIcon?.addEventListener("click", openLoginModal);
openLoginBtn?.addEventListener("click", openLoginModal);

demoLoginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const demoUser = document.getElementById("demoUser").value.trim();
  const demoCode = document.getElementById("demoCode").value.trim();

  // DEMO: valida algo simple (opcional)
  // Ejemplo: permitir cualquier valor no vacío.
  if (!demoUser || !demoCode) return;

  // Guardar solo “sesión demo” (sin secretos)
  const session = {
    demoUser,
    ts: Date.now()
  };
  sessionStorage.setItem("icss_demo_session", JSON.stringify(session));

  // (Opcional) Enviar evento a Google Sheets SIN password/DNI
  if (LOGIN_SHEETS_ENDPOINT) {
    try {
      await fetch(LOGIN_SHEETS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "demo_login",
          demoUser,
          userAgent: navigator.userAgent,
          ts: new Date().toISOString()
        })
      });
    } catch (_) {
      // Si falla, no bloqueamos la demo
    }
  }

  loginModal.close();
  window.location.href = "form.html";
});
