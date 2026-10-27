/**
 * ============================================================
 * MENU DE NAVIGATION — Dolphe Yong
 * Fichier : JS/menu.js
 * Chargé dynamiquement par include-menu.js
 * ============================================================
 */

'use strict';

if (document.querySelector('.main-navbar')) {
    initMenu();
} else {
    const menuScriptUrl = document.currentScript.src;
    const menuUrl = new URL('../Contenue/menu.html', menuScriptUrl);
    const projectUrl = new URL('../', menuScriptUrl);

    fetch(menuUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Chargement du menu impossible (${response.status}).`);
            }
            return response.text();
        })
        .then((markup) => {
            const template = document.createElement('template');
            template.innerHTML = markup;

            template.content.querySelectorAll('a[href]').forEach((link) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !/^[a-z][a-z\d+.-]*:/i.test(href)) {
                    link.href = new URL(href, projectUrl).href;
                }
            });

            const placeholder = document.querySelector('#menu-placeholder');
            if (placeholder) {
                placeholder.replaceWith(template.content);
            } else {
                document.body.prepend(template.content);
            }

            initMenu();
        })
        .catch((error) => console.error('[menu] Impossible de charger le menu.', error));
}

function initMenu() {

    const navbar  = document.querySelector('.main-navbar');
    const toggle  = document.querySelector('.main-navbar__toggle');
    const nav     = document.querySelector('.main-navbar__nav');
    const overlay = document.querySelector('.main-navbar__overlay');

    if (!navbar || !toggle || !nav) {
        console.warn('[menu] Éléments du menu introuvables.');
        return;
    }

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

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });

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
    const currentFile = (window.location.pathname.split('/').pop() || 'index.html')
        .split('#')[0]
        .split('?')[0];

    nav.querySelectorAll('.main-navbar__link').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;

        // Récupérer juste le nom de fichier (ex: "../Contenue/lecon-css.html" → "lecon-css.html")
        const linkFile = href.split('/').pop().split('#')[0].split('?')[0];

        if (linkFile === currentFile) {
            link.classList.add('main-navbar__link--active');
            link.setAttribute('aria-current', 'page');
        }
    });

}