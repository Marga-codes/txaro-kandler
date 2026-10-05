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

// TIRAS DE VIDEO (showreel / backstage): clic para reproducir
document.querySelectorAll('.showreel-video').forEach(strip => {
  const player = strip.querySelector('video');
  if (!player) return;
  const play = () => {
    if (strip.classList.contains('playing')) return;
    player.controls = true;
    player.play();
    strip.classList.add('playing');
  };
  strip.addEventListener('click', play);
  strip.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      play();
    }
  });
});

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

// CONTACTO: envio via FormSubmit (AJAX) a txarokandler@gmail.com
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const formNote = document.getElementById('form-note');
  const submitBtn = contactForm.querySelector('.form-submit');
  const emailInput = contactForm.querySelector('#email');
  const DISPOSABLE = new Set(['mailinator.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com', 'tempmail.com', 'temp-mail.org', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'maildrop.cc']);

  const emailFormatOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  async function domainReceivesMail(domain) {
    const query = async type => {
      const r = await fetch('https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=' + type);
      if (!r.ok) throw new Error('dns');
      return (await r.json()).Answer || [];
    };
    if ((await query('MX')).length) return true;  // tiene servidores de correo
    if ((await query('A')).length) return true;   // dominio existe (MX implicito)
    return false;
  }

  async function emailError(v) {
    const domain = v.split('@')[1].toLowerCase();
    if (DISPOSABLE.has(domain)) return 'No se aceptan direcciones de email temporales.';
    try {
      if (!(await domainReceivesMail(domain))) return 'Ese dominio de email no existe o no puede recibir mensajes. Revisa la dirección.';
    } catch (err) {
      return null; // sin conexión al DNS: no bloqueamos el envío
    }
    return null;
  }

  const setNote = (msg, isError) => {
    if (!formNote) return;
    formNote.textContent = msg;
    formNote.classList.toggle('is-error', !!isError);
  };

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (contactForm.querySelector('[name="_honey"]').value) return; // bot
    const btnLabel = submitBtn.firstChild;

    // Verificacion del email: formato + dominio real con DNS
    const emailVal = emailInput.value.trim();
    if (!emailFormatOk(emailVal)) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      setNote('Introduce un email válido (nombre@dominio.com).', true);
      return;
    }
    submitBtn.disabled = true;
    btnLabel.textContent = 'Verificando… ';
    const emailErr = await emailError(emailVal);
    if (emailErr) {
      submitBtn.disabled = false;
      btnLabel.textContent = 'Enviar mensaje';
      emailInput.setAttribute('aria-invalid', 'true');
      setNote(emailErr, true);
      return;
    }
    emailInput.removeAttribute('aria-invalid');

    submitBtn.disabled = true;
    btnLabel.textContent = 'Enviando… ';
    setNote('', false);
    try {
      const data = Object.fromEntries(new FormData(contactForm).entries());
      const res = await fetch('https://formsubmit.co/ajax/txarokandler@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      contactForm.reset();
      setNote('Mensaje enviado. Te responderé lo antes posible.', false);
    } catch (err) {
      setNote('No se pudo enviar. Escríbeme directamente a txarokandler@gmail.com o por WhatsApp.', true);
    } finally {
      submitBtn.disabled = false;
      btnLabel.textContent = 'Enviar mensaje';
    }
  });

  emailInput.addEventListener('input', () => {
    emailInput.removeAttribute('aria-invalid');
    if (formNote && formNote.classList.contains('is-error')) setNote('', false);
  });
}
