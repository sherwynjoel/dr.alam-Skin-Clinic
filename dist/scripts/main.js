// ============================================================
// INITIALIZATION
// ============================================================
const init = () => {
    console.log('Premium Main.js initialized.');
    
    initLenis();
    initScrollReveal();
    initNavigation();
    initHeroSlider();
    initImageSliders();
    initMagneticEffects();
    initCounterAnimations();
    initFAQ();
    initSpotlight();
    initBookingForm();
    initCursor();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================================
// 0. GLOBAL SMOOTH SCROLL (LENIS)
// ============================================================
function initLenis() {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js";
    script.onload = () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { offset: -80 });
                }
            });
        });
    };
    document.head.appendChild(script);
}

// ============================================================
// 1. CINEMATIC PRELOADER
// ============================================================
const preloader = document.getElementById('preloader');
const hidePreloader = () => {
    if (preloader && !document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => { preloader.style.display = 'none'; }, 800);
        }, 800);

        // Immediate Reveal for Top Elements
        setTimeout(() => {
            document.querySelectorAll('.animate-fade-up').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight + 100) el.classList.add('fade-up-active');
            });
        }, 1200);
    }
};

window.addEventListener('load', () => setTimeout(hidePreloader, 400));
setTimeout(hidePreloader, 3500); 

// ============================================================
// 2. SCROLL REVEAL (INTERSECTION OBSERVER)
// ============================================================
function initScrollReveal() {
    const fadeEls = document.querySelectorAll('.animate-fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up-active');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    fadeEls.forEach(el => fadeObserver.observe(el));

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    
    document.querySelectorAll('.grid .card, .grid a.card').forEach((card, i) => {
        card.classList.add('stagger-child');
        card.style.transitionDelay = `${(i % 4) * 100}ms`;
        staggerObserver.observe(card);
    });

    // Fail-safe reveal
    setTimeout(() => {
        document.querySelectorAll('.animate-fade-up:not(.fade-up-active)').forEach(el => el.classList.add('fade-up-active'));
        document.querySelectorAll('.stagger-child:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 4500);
}

// ============================================================
// 3. NAVIGATION & INTERACTIVE UI
// ============================================================
function initNavigation() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    const dock = document.querySelector('.contact-dock');

    mobileBtn?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        mobileBtn.innerHTML = navLinks?.classList.contains('active') ? '✕' : '☰';
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 40) header?.classList.add('scrolled');
        else header?.classList.remove('scrolled');

        if (scrollY > 400) dock?.classList.add('visible');
        else dock?.classList.remove('visible');
    }, { passive: true });
}

// ============================================================
// 4. HERO SECTION SLIDER
// ============================================================
function initHeroSlider() {
    const cards = document.querySelectorAll('.result-arch-card');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    
    if (!cards.length || !slides.length) return;

    let currentIndex = 0;
    const updateSlider = (index) => {
        if (index >= cards.length) currentIndex = 0;
        else if (index < 0) currentIndex = cards.length - 1;
        else currentIndex = index;

        cards.forEach((card, i) => {
            card.style.display = (i === currentIndex) ? 'block' : 'none';
            if (i === currentIndex) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            }
        });

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentIndex) slide.classList.add('active');
        });
    };

    nextBtn?.addEventListener('click', () => updateSlider(currentIndex + 1));
    prevBtn?.addEventListener('click', () => updateSlider(currentIndex - 1));

    let autoPlay = setInterval(() => updateSlider(currentIndex + 1), 8000);
    const resetAutoPlay = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => updateSlider(currentIndex + 1), 8000);
    };
    [nextBtn, prevBtn].forEach(btn => btn?.addEventListener('click', resetAutoPlay));
}

// ============================================================
// 5. MAGNETIC EFFECTS (DESKTOP & TOUCH)
// ============================================================
function initMagneticEffects() {
    const magneticEls = document.querySelectorAll('.btn, .mobile-menu-btn, .dock-item, .fab-whatsapp, .fab-contact, .nav-links a');
    
    magneticEls.forEach(el => {
        const applyEffect = (x, y) => {
            const rect = el.getBoundingClientRect();
            const mx = (x - rect.left - rect.width / 2) * 0.4;
            const my = (y - rect.top - rect.height / 2) * 0.4;
            el.style.transform = `translate(${mx}px, ${my}px)`;
        };
        
        el.addEventListener('mousemove', (e) => applyEffect(e.clientX, e.clientY));
        el.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            applyEffect(touch.clientX, touch.clientY);
        }, { passive: true });

        const reset = () => el.style.transform = '';
        el.addEventListener('mouseleave', reset);
        el.addEventListener('touchend', reset);
    });
}

// ============================================================
// 6. IMAGE SLIDERS (INTERACTIVE)
// ============================================================
function initImageSliders() {
    document.querySelectorAll('[data-slider]').forEach(slider => {
        const afterImg = slider.querySelector('.ba-slider-after');
        const handle = slider.querySelector('.ba-slider-handle');
        if (!afterImg || !handle) return;

        const move = (e) => {
            const rect = slider.getBoundingClientRect();
            let x = ((e.pageX || e.touches?.[0].pageX) - rect.left - window.scrollX);
            x = Math.max(0, Math.min(x, rect.width));
            const pct = (x / rect.width) * 100;
            afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
            handle.style.left = `${pct}%`;
        };
        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);
    });
}

// ============================================================
// 7. COUNTERS & STATS
// ============================================================
function initCounterAnimations() {
    const statItems = document.querySelectorAll('.stat-item');
    if (!statItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.stat-number');
                const target = parseInt(entry.target.dataset.target, 10);
                const suffix = entry.target.dataset.suffix || '';
                
                let start = null;
                const step = (ts) => {
                    if (!start) start = ts;
                    const progress = Math.min((ts - start) / 1800, 1);
                    numEl.textContent = Math.floor((1 - Math.pow(1 - progress, 4)) * target) + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statItems.forEach(el => observer.observe(el));
}

// ============================================================
// 8. FAQ & SPOTLIGHT & OTHER
// ============================================================
function initFAQ() {
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });
}

function initSpotlight() {
    const wrap = document.getElementById('clinical-spotlight-wrap');
    const overlay = document.getElementById('spotlight-overlay');
    if (!wrap || !overlay) return;

    const update = (x, y) => {
        const rect = wrap.getBoundingClientRect();
        const px = ((x - rect.left) / rect.width) * 100;
        const py = ((y - rect.top) / rect.height) * 100;
        overlay.style.maskImage = `radial-gradient(circle 120px at ${px}% ${py}%, transparent 0%, black 80%)`;
        overlay.style.webkitMaskImage = `radial-gradient(circle 120px at ${px}% ${py}%, transparent 0%, black 80%)`;
    };
    wrap.addEventListener('mousemove', (e) => update(e.clientX, e.clientY));
    wrap.addEventListener('touchmove', (e) => update(e.touches[0].clientX, e.touches[0].clientY));
}

function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Capture Form Data
        const formData = new FormData(form);
        const name = formData.get('Full_Name') || 'Patient';
        const phone = formData.get('Phone_Number') || 'Not provided';
        const service = formData.get('Service') || 'General Consultation';
        const doctor = formData.get('Doctor') || 'Any Specialist';
        const date = formData.get('Preferred_Date') || 'TBD';
        const time = formData.get('Preferred_Time') || 'TBD';

        // 2. Format Professional Message
        const messageBody = `Hello Dr. Alam's Clinic,\n\nI would like to book a professional consultation.\n\n*Patient Details:*\n- Name: ${name}\n- Phone: ${phone}\n\n*Appointment Details:*\n- Service: ${service}\n- Doctor: ${doctor}\n- Date: ${date}\n- Time: ${time}\n\nThank you!`;
        
        // 3. Generate Secure Communication Links
        // Using clinical WhatsApp: +91 93454 10038
        const whatsappUrl = `https://wa.me/919345410038?text=${encodeURIComponent(messageBody)}`;
        
        const emailSubject = `Appointment Request: ${name}`;
        const emailBodyPlain = messageBody.replace(/\*/g, ''); // Remove formatting for email
        const emailUrlValue = `mailto:admin@dralamdermcentre.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyPlain)}`;

        // 4. Populate Success Interface
        const modal = document.getElementById('booking-success-modal');
        const waBtn = document.getElementById('modal-whatsapp-btn');
        const emailBtn = document.getElementById('modal-email-btn');

        if (waBtn) waBtn.href = whatsappUrl;
        if (emailBtn) emailBtn.href = emailUrlValue;
        
        // 5. Trigger Luxury Transformation Overlay
        if (modal) {
            modal.classList.add('active');
            
            // Auto-close overlay when an action is taken to return to site
            [waBtn, emailBtn].forEach(btn => {
                btn?.addEventListener('click', () => {
                    setTimeout(() => modal.classList.remove('active'), 1000);
                    form.reset();
                });
            });
        }
    });
}

function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const aura = document.querySelector('.cursor-aura');
    if (!dot || !aura) return;

    document.addEventListener('mousemove', (e) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        aura.animate({ left: e.clientX + 'px', top: e.clientY + 'px' }, { duration: 400, fill: "forwards" });
    }, { passive: true });
}
