/* ============================================================
   KAROLIS EID — main.js
   ============================================================ */

// Vienintelė vieta, kur keičiama rezervacijos nuoroda (Setmore)
const BOOKING_URL = "https://karoliseid.setmore.com/";

document.querySelectorAll("[data-booking]").forEach(function (a) {
  a.href = BOOKING_URL;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Navigacija: fonas paslinkus ---------- */

const navbar = document.getElementById("navbar");

function onScroll() {
  navbar.classList.toggle("is-solid", window.scrollY > 40);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobilus meniu ---------- */

const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", function () {
  const open = navLinks.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Uždaryti meniu" : "Atidaryti meniu");
});

navLinks.addEventListener("click", function (e) {
  if (e.target.closest("a")) {
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Paslaugų kortelės (išskleidžiamos detalės) ---------- */

function closeCard(btn) {
  const body = document.getElementById(btn.getAttribute("aria-controls"));
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = "Plačiau";
  body.style.maxHeight = "0px";
  body.classList.remove("is-open");
  body.addEventListener("transitionend", function hide() {
    if (btn.getAttribute("aria-expanded") === "false") body.hidden = true;
    body.removeEventListener("transitionend", hide);
  });
}

document.querySelectorAll(".scard-more").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const body = document.getElementById(btn.getAttribute("aria-controls"));
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    // uždaryti kitas atidarytas korteles
    document.querySelectorAll('.scard-more[aria-expanded="true"]').forEach(function (other) {
      if (other !== btn) closeCard(other);
    });

    if (isOpen) {
      closeCard(btn);
    } else {
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "Suskleisti";
      body.hidden = false;
      body.classList.add("is-open");
      requestAnimationFrame(function () {
        body.style.maxHeight = body.scrollHeight + "px";
      });
    }
  });
});

// Perskaičiuoti atidarytos kortelės aukštį keičiant lango dydį
window.addEventListener("resize", function () {
  document.querySelectorAll('.scard-more[aria-expanded="true"]').forEach(function (btn) {
    const body = document.getElementById(btn.getAttribute("aria-controls"));
    body.style.maxHeight = body.scrollHeight + "px";
  });
});

/* ---------- Reveal animacijos ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
} else {
  document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
}

/* ---------- Video: gerbiam judesio mažinimą ---------- */

const heroVideo = document.getElementById("heroVideo");
if (reduceMotion && heroVideo) {
  heroVideo.pause();
  heroVideo.removeAttribute("autoplay");
}

// Naršyklės pristabdo foninių tabų video — grįžus tęsiam
if (!reduceMotion && heroVideo) {
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && heroVideo.paused) {
      heroVideo.play().catch(function () {});
    }
  });
}

/* ---------- Žemėlapis (Leaflet + CARTO dark) ---------- */

const STUDIO = { lat: 54.8766168, lng: 23.9344916 };
const GOOGLE_DIR = "https://www.google.com/maps/dir/?api=1&destination=" + STUDIO.lat + "," + STUDIO.lng;
const WAZE_DIR = "https://waze.com/ul?ll=" + STUDIO.lat + "," + STUDIO.lng + "&navigate=yes";

if (typeof L !== "undefined" && document.getElementById("map")) {
  const map = L.map("map", {
    center: [STUDIO.lat, STUDIO.lng],
    zoom: 15,
    scrollWheelZoom: false,
    // telefone vieno piršto tempimas paliekamas puslapio slinkimui
    dragging: !L.Browser.mobile,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  const pin = L.divIcon({
    className: "",
    html:
      '<div class="ke-pin" title="Karolis Eid — barberis">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16302b" stroke-width="2.4">' +
      '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>' +
      '<path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/></svg></div>',
    iconSize: [38, 38],
    iconAnchor: [7, 36],
    popupAnchor: [12, -34],
  });

  const marker = L.marker([STUDIO.lat, STUDIO.lng], {
    icon: pin,
    title: "Karolis Eid — A. Juozapavičiaus pr. 95",
    alt: "Studijos vieta žemėlapyje",
  }).addTo(map);

  marker.bindPopup(
    '<div class="map-popup"><strong>Karolis Eid · A. Juozapavičiaus pr. 95</strong>' +
      '<div class="map-routes">' +
      '<a href="' + GOOGLE_DIR + '" target="_blank" rel="noopener">Google Maps</a>' +
      '<a href="' + WAZE_DIR + '" target="_blank" rel="noopener">Waze</a>' +
      "</div></div>"
  );
}
