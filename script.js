document.addEventListener('DOMContentLoaded', function () {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── TYPED.JS ──────────────────────────────────────────────
    // The span already contains a fallback text, so nothing is empty if the CDN fails.
    if (typeof Typed !== 'undefined' && !reduceMotion) {
        new Typed('#typed', {
            strings: [
                'FRONTEND DEVELOPER',
                'REACT DEVELOPER',
                'UI ENGINEER',
                'CREATIVE CODER'
            ],
            typeSpeed: 55,
            backSpeed: 35,
            backDelay: 2200,
            loop: true,
            cursorChar: '_',
            smartBackspace: true
        });
    }

    // ── STAR FIELD ────────────────────────────────────────────
    const canvas = document.getElementById('stars');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Positions are stored as 0–1 fractions so they scale with the screen on resize
        const stars = Array.from({ length: 180 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() < 0.08 ? 1.5 : 0.8,
            o: Math.random() * 0.7 + 0.3,
            red: Math.random() < 0.06
        }));

        function drawStars() {
            const host = canvas.parentElement;
            canvas.width = host.offsetWidth;
            canvas.height = host.offsetHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.red
                    ? `rgba(180,40,40,${s.o})`
                    : `rgba(240,237,232,${s.o})`;
                ctx.fill();
            });
        }

        drawStars();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(drawStars, 100);
        });
    }

    // ── CUSTOM CURSOR (mouse users only) ──────────────────────
    const cursor = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursor && ring && hasMouse) {
        document.addEventListener('mousemove', e => {
            // Reveal only after the first movement so there is no stray dot at 0,0
            cursor.classList.add('is-active');
            ring.classList.add('is-active');
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
            ring.style.left   = e.clientX + 'px';
            ring.style.top    = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-active');
            ring.classList.remove('is-active');
        });

        // Delegated hover state, so elements added later also work
        const interactive = 'a, button, input, textarea, label';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(interactive)) {
                ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
                ring.style.borderColor = 'var(--red-core)';
            }
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(interactive)) {
                ring.style.transform = 'translate(-50%, -50%) scale(1)';
                ring.style.borderColor = 'var(--red-dim)';
            }
        });
    }

    // ── SMOOTH SCROLL FOR NAV LINKS ───────────────────────────
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
                // Close mobile navbar
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
            }
        });
    });

    // ── ACTIVE NAV + NAVBAR BACKGROUND ON SCROLL ──────────────
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');

    function onScroll() {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 220) current = s.id;
        });
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + current;
            link.classList.toggle('active', isActive);
        });

        if (navbar) {
            navbar.style.background = window.scrollY > 80
                ? 'rgba(0,0,0,0.98)'
                : 'rgba(0,0,0,0.92)';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── FADE IN ON SCROLL ─────────────────────────────────────
    // After the reveal finishes, the helper classes are removed so they
    // don't override the cards' own hover transitions.
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const fadeElements = document.querySelectorAll('.project-card, .mission-card, .terminal-panel, .cert-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('visible');
                    observer.unobserve(el);
                    setTimeout(() => el.classList.remove('fade-in', 'visible'), 700);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ── CERTIFICATE VIEWER ────────────────────────────────────
    const dialog = document.getElementById('certDialog');
    if (dialog) {
        document.querySelectorAll('[data-cert-open]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof dialog.showModal === 'function') dialog.showModal();
                else dialog.setAttribute('open', '');
            });
        });

        const closeDialog = () => {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
        };

        dialog.querySelector('[data-cert-close]').addEventListener('click', closeDialog);

        // Click on the dark backdrop closes it (Esc already works natively)
        dialog.addEventListener('click', e => {
            if (e.target === dialog) closeDialog();
        });
    }

});
