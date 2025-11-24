document.addEventListener("DOMContentLoaded", () => {
  const headerMain = document.querySelector(".header-main");
  const toggle = document.querySelector(".nav-toggle");

  if (headerMain && toggle) {
    toggle.addEventListener("click", () => {
      headerMain.classList.toggle("is-open");
    });
  }
});
