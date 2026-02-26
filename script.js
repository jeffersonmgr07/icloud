const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginBtn");
const goLoginIcon = document.getElementById("goLogin");
const demoLoginForm = document.getElementById("demoLoginForm");

function openLoginModal() {
  if (loginModal?.showModal) loginModal.showModal();
  else window.location.href = "form.html";
}

openLoginBtn?.addEventListener("click", openLoginModal);
goLoginIcon?.addEventListener("click", openLoginModal);

demoLoginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const demoUser = document.getElementById("demoUser").value.trim();
  const demoNick = document.getElementById("demoNick").value.trim();

  if (!demoUser || !demoNick) return;

  const session = { demoUser, demoNick, ts: Date.now() };
  localStorage.setItem("icss_demo_session", JSON.stringify(session));

  loginModal.close();
  window.location.href = "form.html";
});
