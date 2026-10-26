/**
 * ============================================================
 * MENU DE NAVIGATION — Dolphe Yong
 * Fichier : menu.js
 * ============================================================
 */

'use strict';

(function initMenu() {

    const navbar = document.querySelector('.main-navbar');
    const toggle = document.querySelector('.main-navbar__toggle');
    const nav = document.querySelector('.main-navbar__nav');
    const overlay = document.querySelector('.main-navbar__overlay');

    if (!navbar || !toggle || !nav) return;

    /* ============================================================
       1. EFFET AU SCROLL
       ============================================================ */
    const handleScroll = () => {
        navbar.classList.toggle('main-navbar--scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ============================================================
       2. OUVERTURE / FERMETURE DU MENU MOBILE
       ============================================================ */
    const openMenu = () => {
        nav.classList.add('is-open');
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fermer le menu');
        if (overlay) overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Ouvrir le menu');
        if (overlay) overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Fermer au clic sur un lien
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Fermer au clic sur l'overlay
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });

    // Fermer au redimensionnement (retour desktop)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 900 && nav.classList.contains('is-open')) {
                closeMenu();
            }
        }, 150);
    });

    /* ============================================================
       3. LIEN ACTIF — détection automatique
       ============================================================ */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    nav.querySelectorAll('.main-navbar__link').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;

        const linkFile = href.split('/').pop();
        if (linkFile === currentPath) {
            link.classList.add('main-navbar__link--active');
            link.setAttribute('aria-current', 'page');
        }
    });

})();