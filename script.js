// Login DEMO: no almacena contraseñas. Solo simula “sesión iniciada”.
const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("user").value.trim();
  const promo = document.getElementById("promo").value.trim();
  const remember = document.getElementById("remember").checked;

  // NUNCA guardes el password en front-end.
  // Si quieres un demo, guarda solo un flag y el “usuario” (ficticio).
  const session = { user, promoApplied: !!promo, ts: Date.now() };

  if (remember) {
    localStorage.setItem("icss_demo_session", JSON.stringify(session));
  } else {
    sessionStorage.setItem("icss_demo_session", JSON.stringify(session));
  }

  alert(
    promo
      ? `Demo: sesión iniciada como ${user}\nCódigo promocional: ${promo}`
      : `Demo: sesión iniciada como ${user}`
  );
});
