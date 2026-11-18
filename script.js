// ============================================================
// OUTILS DE BASE
// ============================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Permet d'activer un bouton avec la souris, le doigt ET le clavier (Entrée / Espace)
function onActivate(element, action) {
    element.addEventListener("click", action);
    element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            action();
        }
    });
}

// 1. EFFET MACHINE À ÉCRIRE
const phrase1 = "Bonjour, je suis ";
const phrase2 = "CHRIST MOREL BOGUI";
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
    } else {
        // Le curseur clignotant disparaît 2 secondes après la fin
        setTimeout(() => heroH1.classList.remove("typing"), 2000);
    }
}

window.onload = function() {
    if (reduceMotion) return; // on garde le texte tel quel
    heroH1.innerHTML = "";
    heroH1.classList.add("typing");
    typeWriter();
}

// 2. ANIMATIONS AU SCROLL (sections + cartes une par une)
const sections = document.querySelectorAll("section");
const cards = document.querySelectorAll(".skill-card, .project-card");

cards.forEach(card => card.classList.add("reveal-card"));

function revealCards(section) {
    const sectionCards = section.querySelectorAll(".reveal-card");
    sectionCards.forEach((card, i) => {
        const delay = reduceMotion ? 0 : 150 + i * 90;
        setTimeout(() => card.classList.add("in"), delay);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealCards(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.classList.add("hidden-section");
    observer.observe(section);
});

// 3. CURSEUR PERSONNALISÉ (seulement avec une vraie souris)
if (hasMouse) {
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
}

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

// 5. THÈME CLAIR / SOMBRE (le choix est maintenant mémorisé)
const themeToggle = document.getElementById("themeToggle");

function applyTheme(isLight) {
    document.body.classList.toggle("light-mode", isLight);
    themeToggle.innerHTML = isLight ? "☀️" : "🌙";
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem("theme");
} catch (e) {
    // stockage indisponible : on garde le thème sombre par défaut
}
applyTheme(savedTheme === "light");

onActivate(themeToggle, () => {
    const isLight = !document.body.classList.contains("light-mode");
    applyTheme(isLight);
    try {
        localStorage.setItem("theme", isLight ? "light" : "dark");
    } catch (e) {}
});

// 6. MENU BURGER (se ferme maintenant après un clic sur un lien)
const burger = document.getElementById("burger");
const navLinks = document.querySelector(".nav-links");

function setMenu(open) {
    navLinks.classList.toggle("active", open);
    burger.innerHTML = open ? "✕" : "☰";
}

onActivate(burger, () => setMenu(!navLinks.classList.contains("active")));
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
});

// ============================================================
// NOUVEAUTÉS 2026
// ============================================================

// 7. BARRE DE PROGRESSION + HEADER QUI SE RÉDUIT
const progressBar = document.createElement("div");
progressBar.classList.add("scroll-progress");
document.body.appendChild(progressBar);

const nav = document.querySelector("nav");

function onScroll() {
    const hauteur = document.documentElement.scrollHeight - window.innerHeight;
    if (hauteur > 0) {
        progressBar.style.width = (window.scrollY / hauteur) * 100 + "%";
    }
    nav.classList.toggle("nav-scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", onScroll);
onScroll();

// 8. CARTES QUI S'INCLINENT EN 3D AU SURVOL (souris uniquement)
if (hasMouse && !reduceMotion) {
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            if (!card.classList.contains("in")) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;  // de -0.5 à +0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.classList.add("tilting");
            card.style.transform =
                "perspective(700px) rotateX(" + (-y * 10) + "deg) rotateY(" + (x * 10) + "deg) translateY(-5px)";
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("tilting");
            card.style.transform = "";
        });
    });
}

// 9. PARTICULES DANS LE HERO (canvas léger)
const hero = document.getElementById("hero");

if (!reduceMotion) {
    const canvas = document.createElement("canvas");
    canvas.classList.add("hero-particles");
    hero.prepend(canvas);
    const ctx = canvas.getContext("2d");

    let w = 0, h = 0;
    let particles = [];
    let visible = true;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = hero.clientWidth;
        h = hero.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(60, Math.floor(w / 22));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.8
        }));
    }

    function draw() {
        if (visible) {
            ctx.clearRect(0, 0, w, h);
            // Couleur des particules selon le thème (bleu foncé en mode clair)
            const rgb = document.body.classList.contains("light-mode") ? "0, 119, 182" : "0, 212, 255";

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(" + rgb + ", 0.7)";
                ctx.fill();
            }

            // Traits entre les particules proches
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = "rgba(" + rgb + "," + (0.25 * (1 - dist / 120)) + ")";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(draw);
    }

    // On met l'animation en pause quand le hero n'est plus à l'écran
    new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
    }).observe(hero);

    window.addEventListener("resize", resize);
    resize();
    draw();
}