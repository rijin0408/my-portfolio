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

// ===== Active nav link using IntersectionObserver (robust + bottom fallback) =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');

// Map href -> link
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

// Pick the section with the largest visible area
const io = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length) {
      setActive("#" + visible[0].target.id);
    }
  },
  {
    // Slightly looser margins so last section can be detected earlier
    threshold: [0.1, 0.25, 0.5, 0.75, 1.0],
    rootMargin: "-10% 0px -20% 0px",
  }
);

// Observe sections
sections.forEach((sec) => io.observe(sec));

// Fallback: force Contact active when near bottom
window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5;
  if (nearBottom) setActive("#contact-preview");
});

// Also set active based on the current scroll on load
function setActiveOnLoad() {
  const y = window.scrollY + 100;
  let current = "#top";
  sections.forEach((sec) => {
    if (sec.offsetTop <= y) current = "#" + sec.id;
  });
  setActive(current);
}
window.addEventListener("load", setActiveOnLoad);

// Keep click behavior
navLinks.forEach((link) => {
  link.addEventListener("click", () => setActive(link.getAttribute("href")));
});

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

// ===== Lightbox functionality =====
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
