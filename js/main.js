// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Animated navbar on scroll
const navbar = document.querySelector(".navbar");
function handleNavbarScroll() {
  if (window.scrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}
window.addEventListener("scroll", handleNavbarScroll);
handleNavbarScroll();

// Active nav link using IntersectionObserver
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');

const linkMap = {};
navLinks.forEach((link) => (linkMap[link.getAttribute("href")] = link));

function setActive(href) {
  navLinks.forEach((l) => {
    l.classList.remove("active");
    l.removeAttribute("aria-current");
  });
  const el = linkMap[href];
  if (el) {
    el.classList.add("active");
    el.setAttribute("aria-current", "page");
  }
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive("#" + entry.target.id);
    });
  },
  { root: null, rootMargin: "-30% 0px -50% 0px", threshold: 0 }
);

sections.forEach((sec) => io.observe(sec));
navLinks.forEach((link) =>
  link.addEventListener("click", () => setActive(link.getAttribute("href")))
);

// Scroll progress bar
const progress = document.getElementById("scroll-progress");
function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const width = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = width + "%";
}
window.addEventListener("scroll", updateProgress);
updateProgress();

// Close mobile menu after clicking a link
const navCollapse = document.getElementById("nav");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navCollapse && navCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.hide();
    }
  });
});

// ===== Reveal on scroll =====
const revealItems = document.querySelectorAll("[data-reveal]");
const titleBlocks = document.querySelectorAll(".section-title");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Support data-delay like "120"
        const delay = el.getAttribute("data-delay");
        if (delay)
          el.style.setProperty("--r-delay", `${parseInt(delay, 10)}ms`);
        el.classList.add("show");
        revealObserver.unobserve(el);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
);

revealItems.forEach((el) => revealObserver.observe(el));

// Titles underline grow in view
const titleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inview");
        titleObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
);

titleBlocks.forEach((el) => titleObserver.observe(el));
// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".work img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

// Close on click or Esc key
lightboxClose.addEventListener("click", () =>
  lightbox.classList.remove("show")
);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("show");
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.classList.remove("show");
});
