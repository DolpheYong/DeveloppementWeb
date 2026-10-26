/**
 * ============================================================
 * Dolphe Yong — Formation Développement Web
 * Script principal : navbar, menu mobile, animations au scroll
 * ============================================================
 */

'use strict';

/* ============================================================
   1. NAVBAR — EFFET AU SCROLL
   Ajoute une classe .navbar--scrolled quand l'utilisateur
   fait défiler la page pour renforcer l'ombre et l'opacité.
   ============================================================ */
(function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // État initial
})();


/* ============================================================
   2. MENU MOBILE — OUVERTURE / FERMETURE
   ============================================================ */
(function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Ouvrir le menu');
    };

    const openMenu = () => {
        menu.classList.add('is-open');
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fermer le menu');
    };

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Fermer au clic sur un lien
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Fermer au clic en dehors
    document.addEventListener('click', (e) => {
        if (
            menu.classList.contains('is-open') &&
            !menu.contains(e.target) &&
            !toggle.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });
})();


/* ============================================================
   3. SMOOTH SCROLL — DÉFILEMENT FLUIDE
   Pour les liens d'ancrage internes (#section).
   (Complémentaire à `scroll-behavior: smooth` en CSS,
   utile pour les navigateurs anciens.)
   ============================================================ */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
})();


/* ============================================================
   4. ANIMATIONS AU SCROLL — INTERSECTION OBSERVER
   Ajoute la classe .is-visible quand un élément .reveal
   entre dans le viewport.
   ============================================================ */
(function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (elements.length === 0) return;

    // Fallback si IntersectionObserver n'est pas supporté
    if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach((el) => observer.observe(el));
})();


/* ============================================================
   5. DÉTECTION DE LA SECTION ACTIVE (bonus)
   Optionnel : surligne le lien de menu correspondant à la
   section visible. Utile si vous voulez ajouter un style
   .navbar__link--active en CSS.
   ============================================================ */
(function initActiveSection() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');
    if (sections.length === 0 || navLinks.length === 0) return;

    if (!('IntersectionObserver' in window)) return;

    const linkMap = new Map();
    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            linkMap.set(href.slice(1), link);
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((l) => l.classList.remove('navbar__link--active'));
                    const activeLink = linkMap.get(entry.target.id);
                    if (activeLink) activeLink.classList.add('navbar__link--active');
                }
            });
        },
        {
            rootMargin: '-40% 0px -55% 0px',
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));
})();


/* ============================================================
   6. ANNÉE DYNAMIQUE (bonus)
   Met à jour l'année du copyright automatiquement.
   ============================================================ */
(function initDynamicYear() {
    const yearEl = document.querySelector('.footer__bottom p');
    if (!yearEl) return;
    const currentYear = new Date().getFullYear();
    yearEl.textContent = `© ${currentYear} Dolphe Yong — Tous droits réservés`;
})();