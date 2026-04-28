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
    initConcierge();
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
    }, 2500);
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
    const dots = document.querySelectorAll('.hero-dot');
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
        });

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentIndex) slide.classList.add('active');
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    nextBtn?.addEventListener('click', () => updateSlider(currentIndex + 1));
    prevBtn?.addEventListener('click', () => updateSlider(currentIndex - 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            updateSlider(i);
            resetAutoPlay();
        });
    });

    let autoPlay = setInterval(() => updateSlider(currentIndex + 1), 5000);
    const resetAutoPlay = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => updateSlider(currentIndex + 1), 5000);
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

        let isInteracted = false;
        let animationFrame;

        const updateSlider = (pct) => {
            afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
            handle.style.left = `${pct}%`;
        };

        const onMove = (e) => {
            isInteracted = true;
            cancelAnimationFrame(animationFrame);
            const rect = slider.getBoundingClientRect();
            let x = ((e.pageX || e.touches?.[0].pageX) - rect.left - window.scrollX);
            x = Math.max(0, Math.min(x, rect.width));
            const pct = (x / rect.width) * 100;
            updateSlider(pct);
        };

        slider.addEventListener('mousemove', (e) => { if(e.buttons === 1) onMove(e); });
        slider.addEventListener('mousedown', onMove);
        slider.addEventListener('touchmove', onMove, { passive: true });

        // Full Range Synchronized Animation
        const autoAnimate = (time) => {
            if (isInteracted) return;
            // Oscillate from 0 to 100% with faster cycle (800ms)
            const pct = 50 + Math.sin(time / 800) * 50; 
            updateSlider(pct);
            animationFrame = requestAnimationFrame(autoAnimate);
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isInteracted) {
                animationFrame = requestAnimationFrame(autoAnimate);
            } else {
                cancelAnimationFrame(animationFrame);
            }
        }, { threshold: 0.1 });

        observer.observe(slider);
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

    // --- 1. Dynamic Time Slot Generation ---
    const slotsGrid = document.getElementById('time-slots-grid');
    const timeHidden = document.getElementById('app-time');
    const openingHours = [
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "--- Evening ---",
        "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", 
        "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM"
    ];

    openingHours.forEach(time => {
        const slot = document.createElement('div');
        
        if (time.startsWith('---')) {
            slot.className = 'time-divider';
            slot.textContent = time.replace(/-/g, '').trim();
            slot.style.gridColumn = '1 / -1';
            slot.style.fontSize = '0.7rem';
            slot.style.color = 'rgba(255,255,255,0.3)';
            slot.style.textTransform = 'uppercase';
            slot.style.letterSpacing = '2px';
            slot.style.marginTop = '1rem';
            slot.style.marginBottom = '0.5rem';
            slot.style.textAlign = 'center';
        } else {
            slot.className = 'time-slot';
            slot.textContent = time;
            slot.onclick = () => {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
                timeHidden.value = time;
            };
        }
        slotsGrid.appendChild(slot);
    });

    // --- 2. Simple Luxury Calendar Logic ---
    const daysGrid = document.getElementById('calendar-days-grid');
    const dateHidden = document.getElementById('app-date');
    const monthLabel = document.getElementById('calendar-month');
    const now = new Date();
    let displayMonth = now.getMonth();
    let displayYear = now.getFullYear();

    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    function generateCalendar(month, year) {
        daysGrid.innerHTML = '';
        monthLabel.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            daysGrid.appendChild(document.createElement('div'));
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.textContent = d;
            
            const checkDate = new Date(year, month, d);
            const today = new Date();
            today.setHours(0,0,0,0);

            if (checkDate < today) {
                dayEl.classList.add('disabled');
            } else {
                dayEl.onclick = () => {
                    document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('active'));
                    dayEl.classList.add('active');
                    dateHidden.value = `${d} ${monthNames[month]} ${year}`;
                };
            }
            daysGrid.appendChild(dayEl);
        }
    }

    document.querySelector('.btn-prev').onclick = () => {
        displayMonth--;
        if (displayMonth < 0) { displayMonth = 11; displayYear--; }
        generateCalendar(displayMonth, displayYear);
    };

    document.querySelector('.btn-next').onclick = () => {
        displayMonth++;
        if (displayMonth > 11) { displayMonth = 0; displayYear++; }
        generateCalendar(displayMonth, displayYear);
    };

    generateCalendar(displayMonth, displayYear);

    // --- 3. WhatsApp Redirect Logic ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('app-name').value;
        const service = document.getElementById('app-service').value;
        const date = dateHidden.value;
        const time = timeHidden.value;

        if (!date || !time) {
            alert("Please select both a Date and a Time slot.");
            return;
        }

        const message = `Hello Dr. Alam's Clinic,\n\nI would like to book a clinical appointment.\n\n*Patient Name:* ${name}\n*Treatment:* ${service}\n*Date:* ${date}\n*Time Slot:* ${time}\n\nThank you!`;
        const whatsappUrl = `https://wa.me/919345410038?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    });
}

// ============================================================
// 9. DIGITAL CONCIERGE (SKIN ASSESSMENT)
// ============================================================
function initConcierge() {
    const modal = document.getElementById('concierge-modal');
    const openBtn = document.getElementById('open-concierge');
    const closeBtn = document.getElementById('concierge-close');
    const steps = document.querySelectorAll('.concierge-step');
    const progressBar = document.getElementById('concierge-progress-fill');
    const label = document.getElementById('concierge-step-label');
    const backBtn = document.getElementById('concierge-back');
    const nav = document.getElementById('concierge-nav');
    
    if (!modal || !openBtn) return;

    let currentStep = 1;
    let selections = {};

    const updateUI = () => {
        steps.forEach(s => s.classList.remove('active'));
        const activeStep = document.getElementById(currentStep === 4 ? 'concierge-result' : `step-${currentStep}`);
        activeStep?.classList.add('active');

        // Progress
        const pct = ((currentStep - 1) / 3) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (label) label.textContent = currentStep === 4 ? 'Assessment Complete' : `Step ${currentStep} of 3`;
        
        // Navigation
        if (nav) nav.style.display = (currentStep > 1 && currentStep < 4) ? 'flex' : 'none';
    };

    openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        currentStep = 1;
        updateUI();
    });

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });

    // Handle Option Clicks
    document.querySelectorAll('.concern-btn, .duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            const parentId = btn.closest('.concierge-step').id;
            
            if (parentId === 'step-1') selections.concern = val;
            if (parentId === 'step-2') selections.duration = val;
            if (parentId === 'step-3') selections.prior = val;

            if (currentStep < 3) {
                currentStep++;
                updateUI();
            } else {
                generateResult();
            }
        });
    });

    backBtn?.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    function generateResult() {
        currentStep = 4;
        updateUI();

        const headline = document.getElementById('result-headline');
        const text = document.getElementById('result-text');
        const learnMore = document.getElementById('result-learn-more');

        let recTitle = "Clinical Diagnosis Required";
        let recDesc = "Based on your input, Dr. Alam recommends a detailed skin diagnostic session. We specialize in evidence-based protocols for long-term health.";
        let link = "services.html";

        const c = selections.concern;
        if (c === 'acne') {
            recTitle = "Acne & Scar Restoration Path";
            recDesc = "Your condition suggests a combined approach: Clinical medicine to control active acne, followed by advanced laser resurfacing for scar revision.";
            link = "acne-scars.html";
        } else if (c === 'pigmentation') {
            recTitle = "Pigmentation Correction Protocol";
            recDesc = "Melasma and deep pigmentation require a double-action plan: Medical-grade peels and Q-Switched laser therapy for deep pigment breakdown.";
            link = "pigmentation.html";
        } else if (c === 'hair') {
            recTitle = "Hair Follicle Restoration";
            recDesc = "Early intervention is key. Dr. Alam recommends a clinical assessment for pattern analysis, likely involving medical therapy and GFC/PRP restoration.";
            link = "hair-loss.html";
        }

        if (headline) headline.textContent = recTitle;
        if (text) text.textContent = recDesc;
        if (learnMore) learnMore.setAttribute('href', link);
    }
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
