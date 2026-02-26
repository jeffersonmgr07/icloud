const modal = document.getElementById("loginModal");
const open1 = document.getElementById("openLogin");
const open2 = document.getElementById("openLogin2");
const form = document.getElementById("loginForm");

function openModal(){
  if (typeof modal.showModal === "function") modal.showModal();
  else alert("Tu navegador no soporta <dialog>. Usa Chrome/Edge moderno.");
}

open1.addEventListener("click", openModal);
open2.addEventListener("click", openModal);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("user").value.trim();
  const promo = document.getElementById("promo").value.trim();
  const remember = document.getElementById("remember").checked;

  // DEMO: NO guardes contraseñas, solo sesión ficticia.
  const session = { user, promoApplied: !!promo, ts: Date.now() };

  (remember ? localStorage : sessionStorage).setItem(
    "icss_demo_session",
    JSON.stringify(session)
  );

  modal.close();
  alert(promo ? `Demo: ${user}\nPromo: ${promo}` : `Demo: ${user}`);
});
