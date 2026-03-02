/* ═══════════════════════════════════════════════════════════
   LSTNR Landing Page — Interactions & Animations
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavigation();
    initCounters();
    initEmailCapture();
});

/* ─── Scroll-triggered Fade-In Animations ────────────────── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.anim-fade-up');

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
            rootMargin: '0px 0px -40px 0px',
        }
    );

    elements.forEach((el) => observer.observe(el));
}

/* ─── Navigation ─────────────────────────────────────────── */
function initNavigation() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // Burger toggle
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    links.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            links.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ─── Animated Counters ──────────────────────────────────── */
function initCounters() {
    const statsSection = document.querySelector('.hero__stats');
    if (!statsSection) return;

    const values = statsSection.querySelectorAll('.hero__stat-value');
    let animated = false;

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                // Animate the $28B+ counter
                const tamEl = values[0];
                animateValue(tamEl, 0, 28, 2000, '$', 'B+');
                observer.unobserve(statsSection);
            }
        },
        { threshold: 0.5 }
    );

    observer.observe(statsSection);
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);

        element.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ─── Email Capture ──────────────────────────────────────── */
function initEmailCapture() {
    const input = document.getElementById('ctaEmail');
    const button = document.getElementById('ctaSubmit');

    if (!button || !input) return;

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value.trim();

        if (!email || !isValidEmail(email)) {
            input.style.borderColor = '#F53636';
            input.placeholder = 'Please enter a valid email';
            setTimeout(() => {
                input.style.borderColor = '';
                input.placeholder = 'Enter your email';
            }, 2000);
            return;
        }

        // Success state
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span>✓ Sent!</span>';
        button.style.background = 'linear-gradient(135deg, #00FF9D, #00CC7D)';
        input.value = '';

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
        }, 3000);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
