// ===============================
// CONFIGURACIÓN
// ===============================

// 🔴 IMPORTANTE:
// Pega aquí la URL de tu Web App de Google Apps Script
// Ejemplo: https://script.google.com/macros/s/AKfycbxxxxxxxxxxxx/exec
const SHEETS_ENDPOINT = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";


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
    // Fallback si <dialog> no es soportado
    window.location.href = "form.html";
  }
}

if (openLoginBtn) {
  openLoginBtn.addEventListener("click", openLoginModal);
}

if (goLoginIcon) {
  goLoginIcon.addEventListener("click", openLoginModal);
}


// ===============================
// ENVÍO DEL FORMULARIO DEMO
// ===============================

if (demoLoginForm) {
  demoLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const demoUser = document.getElementById("demoUser").value.trim();
    const demoNick = document.getElementById("demoNick").value.trim();

    if (!demoUser || !demoNick) {
      alert("Completa los campos.");
      return;
    }

    // ===============================
    // GUARDAR SESIÓN LOCAL (DEMO)
    // ===============================
    const session = {
      demoUser,
      demoNick,
      ts: new Date().toISOString()
    };

    localStorage.setItem("icss_demo_session", JSON.stringify(session));

    // ===============================
    // ENVIAR A GOOGLE SHEETS
    // ===============================
    if (SHEETS_ENDPOINT && SHEETS_ENDPOINT !== "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT") {
      try {
        await fetch(SHEETS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            demoUser: demoUser,
            demoNick: demoNick,
            userAgent: navigator.userAgent
          })
        });

        console.log("Datos enviados a Google Sheets correctamente.");

      } catch (error) {
        console.warn("No se pudo enviar a Google Sheets:", error);
      }
    } else {
      console.warn("No has configurado SHEETS_ENDPOINT.");
    }

    // ===============================
    // CERRAR MODAL Y REDIRIGIR
    // ===============================
    if (loginModal) {
      loginModal.close();
    }

    window.location.href = "form.html";
  });
}
