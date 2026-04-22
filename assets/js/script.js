// BrAbel - Interactive JavaScript
// Mobile Navigation, Scroll Effects, and Animations

// ============= VIDEO PRELOADER (pages with #preloader-video only) =============
(function () {
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloader-video');
    const spinner = document.querySelector('.loader-spinner');

    // Only run if the page uses the video-based preloader element
    if (!preloader || !video) return;

    // Lock scroll while loading
    document.body.classList.add('preloading');

    function dismiss() {
        preloader.classList.add('hidden');
        document.body.classList.remove('preloading');
        preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }

    // Play once then dismiss
    video.addEventListener('ended', dismiss);

    video.addEventListener('error', () => {
        if (spinner) { video.style.display = 'none'; spinner.style.display = 'block'; }
        setTimeout(dismiss, 3000);
    });

    video.addEventListener('loadedmetadata', () => {
        const cap = (video.duration * 1000) + 500;
        setTimeout(dismiss, cap);
    });

    setTimeout(dismiss, 8000);

    video.play().catch(() => {
        if (spinner) { video.style.display = 'none'; spinner.style.display = 'block'; }
        setTimeout(dismiss, 3000);
    });
})();

// ============= MOBILE NAVIGATION =============
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && mobileToggle && window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
});

// ============= SCROLL EFFECTS =============
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    if (!navbar) return;
    const currentScroll = window.pageYOffset;

    // Add scrolled class for background blur
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ============= ACTIVE NAV LINK =============
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ============= INTERSECTION OBSERVER FOR ANIMATIONS =============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInElements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .process-step, .pricing-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============= SMOOTH SCROLLING FOR ANCHOR LINKS =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============= DYNAMIC MOCKUP BACKGROUNDS =============
// Generate gradient backgrounds for mockups and portfolio images
function generateGradientBackground(element, hue1, hue2) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `hsl(${hue1}, 70%, 60%)`);
    gradient.addColorStop(1, `hsl(${hue2}, 70%, 50%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some visual elements
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 200 + 50;

        const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        circleGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = circleGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    element.style.backgroundImage = `url(${canvas.toDataURL()})`;
}

// Apply to mockups
const mockup1 = document.getElementById('mockup1');
const mockup2 = document.getElementById('mockup2');
const mockup3 = document.getElementById('mockup3');

if (mockup1) generateGradientBackground(mockup1, 260, 290);
if (mockup2) generateGradientBackground(mockup2, 195, 220);
if (mockup3) generateGradientBackground(mockup3, 330, 260);

// Apply to portfolio previews
const portfolio1 = document.getElementById('portfolio1');
const portfolio2 = document.getElementById('portfolio2');
const portfolio3 = document.getElementById('portfolio3');

if (portfolio1) generateGradientBackground(portfolio1, 260, 195);
if (portfolio2) generateGradientBackground(portfolio2, 195, 260);
if (portfolio3) generateGradientBackground(portfolio3, 330, 290);

// ============= FORM VALIDATION (for contact page) =============
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) errorElement.remove();
            input.style.borderColor = '';
        });

        // Validate
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            }
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                }
            }
        });

        if (isValid) {
            // Show loading state then do a normal POST
            const submitBtn = contactForm.querySelector('.btn-primary');
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            // Native submit — FormSubmit.co handles the redirect via _next
            contactForm.submit();
        }
    });
}

function showError(input, message) {
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = 'color: #ff5f56; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
    input.parentElement.appendChild(error);
    input.style.borderColor = '#ff5f56';

    input.addEventListener('input', () => {
        error.remove();
        input.style.borderColor = '';
    });
}

// ============= PARALLAX EFFECT FOR HERO ORBS =============
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============= NUMBER COUNTER ANIMATION =============
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            if (number) {
                entry.target.textContent = '0' + text.replace(/\d+/, '');
                setTimeout(() => {
                    const suffix = text.replace(/\d+/, '');
                    animateCounter(entry.target, number);
                }, 200);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ============= PRICING TOGGLE (for pricing page) =============
const pricingToggle = document.getElementById('pricingToggle');
const monthlyPrices = document.querySelectorAll('[data-monthly]');
const yearlyPrices = document.querySelectorAll('[data-yearly]');

if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        monthlyPrices.forEach(price => {
            price.style.display = isYearly ? 'none' : 'block';
        });

        yearlyPrices.forEach(price => {
            price.style.display = isYearly ? 'block' : 'none';
        });
    });
}

// ============= PORTFOLIO FILTER (for portfolio page) =============
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter items
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============= CURSOR CUSTOM (Optional Enhancement — desktop only) =============
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0;
`;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(139, 92, 246, 0.2)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'transparent';
        });
    });
}

// ============= PAGE LOAD ANIMATION =============
window.addEventListener('load', () => {
    // Ensure content is visible behind preloader (reverses the CSS opacity: 0 if set previously)
    document.body.style.opacity = '1';

    if (document.getElementById('preloader')) {
        // Optional: Ensure video acts as expected
        const video = document.getElementById('preloader-video');
        if (video) {
            video.play().catch(e => console.log('Autoplay prevented:', e));
        }
        // Note: preloader dismissal is fully handled by the IIFE at the top of this file
        // (via video.ended, video.error, loadedmetadata, and an 8-second hard timeout).
    }
});

// ============= DYNAMIC COPYRIGHT YEAR =============
document.querySelectorAll('.footer-bottom p').forEach(el => {
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                }
            }
        });

        if (isValid) {
            // Show loading state then do a normal POST
            const submitBtn = contactForm.querySelector('.btn-primary');
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            // Native submit — FormSubmit.co handles the redirect via _next
            contactForm.submit();
        }
    });
}

function showError(input, message) {
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = 'color: #ff5f56; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
    input.parentElement.appendChild(error);
    input.style.borderColor = '#ff5f56';

    input.addEventListener('input', () => {
        error.remove();
        input.style.borderColor = '';
    });
}

// ============= PARALLAX EFFECT FOR HERO ORBS =============
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============= NUMBER COUNTER ANIMATION =============
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            if (number) {
                entry.target.textContent = '0' + text.replace(/\d+/, '');
                setTimeout(() => {
                    const suffix = text.replace(/\d+/, '');
                    animateCounter(entry.target, number);
                }, 200);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ============= PRICING TOGGLE (for pricing page) =============
const pricingToggle = document.getElementById('pricingToggle');
const monthlyPrices = document.querySelectorAll('[data-monthly]');
const yearlyPrices = document.querySelectorAll('[data-yearly]');

if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        monthlyPrices.forEach(price => {
            price.style.display = isYearly ? 'none' : 'block';
        });

        yearlyPrices.forEach(price => {
            price.style.display = isYearly ? 'block' : 'none';
        });
    });
}

// ============= PORTFOLIO FILTER (for portfolio page) =============
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter items
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============= CURSOR CUSTOM (Optional Enhancement — desktop only) =============
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0;
`;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(139, 92, 246, 0.2)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'transparent';
        });
    });
}

// ============= PAGE LOAD ANIMATION =============
window.addEventListener('load', () => {
    // Ensure content is visible behind preloader (reverses the CSS opacity: 0 if set previously)
    document.body.style.opacity = '1';

    if (document.getElementById('preloader')) {
        // Optional: Ensure video acts as expected
        const video = document.getElementById('preloader-video');
        if (video) {
            video.play().catch(e => console.log('Autoplay prevented:', e));
        }
        // Note: preloader dismissal is fully handled by the IIFE at the top of this file
        // (via video.ended, video.error, loadedmetadata, and an 8-second hard timeout).
    }
});

// ============= DYNAMIC COPYRIGHT YEAR =============
document.querySelectorAll('.footer-bottom p').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
});

// ============= CONSOLE MESSAGE =============
console.log('%c👋 Welcome to BrAbel!', 'font-size: 20px; font-weight: bold; color: #8b5cf6;');
console.log('%cBuilt with ❤️ and modern web technologies', 'font-size: 14px; color: #64748b');

// ============= BACK TO TOP =============
(function () {
    const btn = document.createElement('button');
    btn.id = 'bra-back-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('bra-back-top--visible', window.scrollY > 300);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ============= WHATSAPP DIRECT FLOAT =============
(function () {
    const wa = document.createElement('a');
    wa.id = 'bra-wa-float';
    wa.href = 'https://wa.me/233209895858?text=Hi%20BrAbel%2C%20I%27d%20like%20to%20discuss%20a%20project.';
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.title = 'Chat on WhatsApp';
    wa.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    document.body.appendChild(wa);
})();

// ============= SCROLL REVEAL =============
(function () {
    const targets = document.querySelectorAll(
        '.service-card, .difference-card, .mission-card, .pillar-card, .scard, .pcard, .tcard, .process-step, .pricing-card, .portfolio-card, .team-card'
    );
    if (!targets.length || !('IntersectionObserver' in window)) return;

    targets.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity .55s ease ${(i % 4) * 0.08}s, transform .55s ease ${(i % 4) * 0.08}s`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => io.observe(el));
})();

// ============= CONTACT FORM SUCCESS BANNER =============
(function () {
    const params = new URLSearchParams(window.location.search);
    if (params.has('sent')) {
        const banner = document.getElementById('formSuccess');
        if (banner) banner.style.display = 'flex';
    }
})();

// ============= NEWSLETTER SUBSCRIBED TOAST =============
(function () {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('subscribed')) return;
    const toast = document.createElement('div');
    toast.id = 'bra-nl-toast';
    toast.innerHTML = '&#x2705; You\'re subscribed! Thanks for joining.';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('bra-nl-toast--show'), 100);
    setTimeout(() => toast.remove(), 4000);
})();
