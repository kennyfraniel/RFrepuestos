// Navegación móvil y utilidades comunes
(function(){
const navBtn = document.querySelector('.nav-toggle');
const nav = document.querySelector('[data-nav]');
if (navBtn && nav){
navBtn.addEventListener('click', () => {
const open = nav.classList.toggle('open');
navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
})();