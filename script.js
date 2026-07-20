// 1. EFFET MACHINE À ÉCRIRE
const phrase1 = "Bonjour, je suis ";
const phrase2 = "Christ.Morel";
const heroH1 = document.querySelector("#hero h1");
let index = 0;

function typeWriter() {
    const total = phrase1 + phrase2;
    if (index < total.length) {
        if (index < phrase1.length) {
            heroH1.innerHTML = phrase1.slice(0, index + 1) + '<span></span>';
        } else {
            heroH1.innerHTML = phrase1 + '<span>' + phrase2.slice(0, index - phrase1.length + 1) + '</span>';
        }
        index++;
        setTimeout(typeWriter, 100);
    }
}

window.onload = function() {
    heroH1.innerHTML = "";
    typeWriter();
}

// 2. ANIMATIONS AU SCROLL (fade in + slide up)
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.classList.add("hidden-section");
    observer.observe(section);
});

// 3. CURSEUR PERSONNALISÉ
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, .skill-card, .project-card").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-grow"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-grow"));
});

// 4. BOUTON RETOUR EN HAUT
const backToTop = document.createElement("div");
backToTop.innerHTML = "↑";
backToTop.classList.add("back-to-top");
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        themeToggle.innerHTML = "☀️";
    } else {
        themeToggle.innerHTML = "🌙";
    }
});

// 6. MENU BURGER
const burger = document.getElementById("burger");
const navLinks = document.querySelector(".nav-links");
burger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    if (navLinks.classList.contains("active")) {
        burger.innerHTML = "✕";
    } else {
        burger.innerHTML = "☰";
    }
});