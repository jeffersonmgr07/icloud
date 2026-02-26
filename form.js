const verifyBtn = document.getElementById("verifyBtn");
const geoStatus = document.getElementById("geoStatus");
const form = document.getElementById("claimForm");
const hello = document.getElementById("hello");

let geoPayload = null;

// Mostrar sesión demo si existe
try {
  const rawSession = localStorage.getItem("icss_demo_session");
  if (hello && rawSession) {
    const s = JSON.parse(rawSession);
    hello.textContent = `Hola, ${s.demoNick} (demo)`;
  } else if (hello) {
    hello.textContent = "Sesión demo no encontrada. Vuelve al inicio e inicia sesión.";
  }
} catch {
  if (hello) hello.textContent = "Sesión demo inválida.";
}

// Geolocalización (demo)
verifyBtn.addEventListener("click", () => {
  geoStatus.textContent = "Solicitando permiso de ubicación…";

  if (!("geolocation" in navigator)) {
    geoStatus.textContent = "Este navegador no soporta geolocalización.";
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
        `Ubicación verificada (demo): ${geoPayload.lat.toFixed(5)}, ${geoPayload.lng.toFixed(5)} · ±${Math.round(geoPayload.accuracy_m)}m`;
    },
    () => {
      geoPayload = null;
      geoStatus.textContent = "Permiso denegado o no disponible.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// Guardar formulario (demo) en localStorage
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("icss_demo_session") || "null");
  } catch {}

  const payload = {
    session,
    ...data,
    geo: geoPayload,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem("icss_claim_data", JSON.stringify(payload));
  alert("Datos guardados (demo). Revisa localStorage: icss_claim_data");
});
