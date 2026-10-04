const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// SCROLL REVEAL
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// MENU MOVIL
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMenu(force) {
  const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  navToggle.classList.toggle('open', open);
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Cerrar menu' : 'Abrir menu');
  document.body.classList.toggle('no-scroll', open);
}

navToggle.addEventListener('click', () => toggleMenu());
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// SHOWREEL EMBED
const showreelVideo = document.getElementById('showreel-video');
const showreelPlayer = document.getElementById('showreel-player');

function playShowreel() {
  if (!showreelVideo || !showreelPlayer || showreelVideo.classList.contains('playing')) return;
  showreelPlayer.controls = true;
  showreelPlayer.play();
  showreelVideo.classList.add('playing');
}

if (showreelVideo) {
  showreelVideo.addEventListener('click', playShowreel);
  showreelVideo.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playShowreel();
    }
  });
}

// LIGHTBOX GALERIA
const galleryItems = [...document.querySelectorAll('.g-item img')];
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function updateLightbox() {
  const img = galleryItems[currentIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.alt;
}

function navigateLightbox(step) {
  currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

galleryItems.forEach((img, i) => {
  img.parentElement.addEventListener('click', () => openLightbox(i));
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click', e => {
  e.stopPropagation();
  navigateLightbox(-1);
});
document.getElementById('lightbox-next').addEventListener('click', e => {
  e.stopPropagation();
  navigateLightbox(1);
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// CONTACTO (envio pendiente de conectar): validacion nativa + sin recarga
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const formNote = document.getElementById('form-note');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (formNote) formNote.textContent = 'Formulario listo: falta conectar el servicio de envío.';
  });
}
