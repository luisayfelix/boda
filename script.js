// Fecha del evento (Perú). Para evitar líos de zona horaria, usamos una fecha UTC equivalente.
// Perú = UTC-5, entonces 2026-01-27 15:30 (UTC-5) => 2026-01-27 20:30 (UTC)
const EVENT_UTC_ISO = "2026-01-27T20:30:00Z";

// ====== Mobile Menu ======
const header = document.querySelector(".nav");
const burger = document.querySelector(".nav__burger");
const links = document.querySelectorAll(".nav__links a");

if (burger && header) {
  burger.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav--open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach(a => a.addEventListener("click", () => {
    header.classList.remove("nav--open");
    burger.setAttribute("aria-expanded", "false");
  }));
}

// ====== Countdown ======
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

const target = new Date(EVENT_UTC_ISO).getTime();

function pad2(n) { return String(n).padStart(2, "0"); }

function tick() {
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (dEl) dEl.textContent = pad2(days);
  if (hEl) hEl.textContent = pad2(hours);
  if (mEl) mEl.textContent = pad2(minutes);
  if (sEl) sEl.textContent = pad2(seconds);
}

tick();
setInterval(tick, 1000);

// ====== Carousel ======
(function initCarousel(){
  const track = document.querySelector(".carousel__track");
  const slides = Array.from(document.querySelectorAll(".carousel__slide"));
  const dotsWrap = document.querySelector(".carousel__dots");
  const prevBtn = document.querySelector(".carousel__btn--prev");
  const nextBtn = document.querySelector(".carousel__btn--next");

  if (!track || slides.length === 0 || !dotsWrap) return;

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel__dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-label", `Ir a foto ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn && prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn && nextBtn.addEventListener("click", () => goTo(index + 1));

  // Swipe (touch)
  const viewport = document.querySelector(".carousel__viewport");
  if (viewport){
    viewport.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, {passive:true});

    viewport.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, {passive:true});

    viewport.addEventListener("touchend", () => {
      if (!isDragging) return;
      const diff = currentX - startX;

      if (Math.abs(diff) > 40){
        if (diff < 0) goTo(index + 1);
        else goTo(index - 1);
      }
      isDragging = false;
      startX = 0;
      currentX = 0;
    });
  }

  // Autoplay (opcional)
  const AUTOPLAY = true;
  const INTERVAL_MS = 4500;

  if (AUTOPLAY){
    setInterval(() => goTo(index + 1), INTERVAL_MS);
  }

  update();
})();
