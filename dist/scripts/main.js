document.addEventListener('DOMContentLoaded', () => {

    // ── 0. Cinematic Preloader ───────────────────────────────
    const preloader = document.getElementById('preloader');
    
    function hidePreloader() {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 800);
        }
    }

    // Load event (all images etc)
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 400); // Small grace period for a premium feel
    });

    // Failsafe: Hide preloader after 3 seconds regardless of load state
    setTimeout(hidePreloader, 3000);

    // ── Mobile navigation toggle ──────────────────────────────
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks  = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            mobileBtn.innerHTML = isExpanded ? '✕' : '☰';
            mobileBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // ── Sticky header glassmorphism ───────────────────────────
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ── 1. Scroll-reveal fade-up ──────────────────────────────
    const fadeEls = document.querySelectorAll('.animate-fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up-active');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeEls.forEach(el => fadeObserver.observe(el));

    // ── 2. Staggered card entrance ────────────────────────────
    // Mark cards inside grids as stagger children
    document.querySelectorAll('.grid .card, .grid a.card').forEach((card, i) => {
        card.classList.add('stagger-child');
        card.style.transitionDelay = `${i * 100}ms`;
    });
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.stagger-child').forEach(el => staggerObserver.observe(el));

    // ── 3. Parallax hero background ──────────────────────────
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroSection.style.backgroundPositionY = `calc(center + ${scrolled * 0.35}px)`;
        }, { passive: true });
    }



    // ── 5. Animated scroll counters ──────────────────────────
    function animateCounter(el, target, suffix, duration = 1800) {
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item   = entry.target;
                    const numEl  = item.querySelector('.stat-number');
                    const target = parseInt(item.dataset.target, 10);
                    const suffix = item.dataset.suffix || '';
                    animateCounter(numEl, target, suffix);
                    counterObserver.unobserve(item);
                }
            });
        }, { threshold: 0.5 });
        statItems.forEach(el => counterObserver.observe(el));
    }

    // ── 6. Heading reveal underline ───────────────────────────
    document.querySelectorAll('h2').forEach(h => h.classList.add('reveal-heading'));
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('heading-revealed');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.reveal-heading').forEach(h => headingObserver.observe(h));

    // ── Form validation ───────────────────────────────────────
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            bookingForm.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = '';
                }
            });
            if (isValid) {
                alert('Thank you! We will contact you shortly.');
                bookingForm.reset();
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // ── Smooth scroll for anchor links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 82,
                    behavior: 'smooth'
                });
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileBtn) mobileBtn.innerHTML = '☰';
                }
            }
        });
    });


    // ── 8. Interactive Before/After Slider ────────────────────
    const sliders = document.querySelectorAll('[data-ba-slider]');
    sliders.forEach(slider => {
        const afterImg = slider.querySelector('.ba-image-after');
        const handle   = slider.querySelector('.ba-handle');
        
        const move = (e) => {
            const rect = slider.getBoundingClientRect();
            let x = (e.pageX || e.touches[0].pageX) - rect.left - window.scrollX;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            
            afterImg.style.clipPath = `inset(0 0 0 ${percent}%)`;
            handle.style.left = `${percent}%`;
        };

        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);
    });

    // Testimonials carousel logic removed - now using static grid display.



    // ── 11. 3D Card Tilt ────────────────────────────────────
    const tiltCards = document.querySelectorAll('.card, .outcome-card');
    tiltCards.forEach(card => {
        card.classList.add('card-tilt');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // ── 12. Slider Auto-Peek Trigger ──────────────────────────
    const baSlider = document.querySelector('[data-ba-slider]');
    if (baSlider) {
        const handle = baSlider.querySelector('.ba-handle');
        
        const peekObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handle.classList.add('handle-peek-active');
                    setTimeout(() => {
                        handle.classList.remove('handle-peek-active');
                    }, 1300);
                    peekObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        peekObserver.observe(baSlider);
    }

    // ── 13. Page Progress Bar ────────────────────────────────
    const progressLine = document.getElementById('page-progress');
    if (progressLine) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressLine.style.width = scrolled + "%";
        }, { passive: true });
    }

    // ── 14. Magnetic Buttons (Luxury Attraction) ──────────────
    document.querySelectorAll('.btn, .mobile-menu-btn, .fab-contact').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle 35% magnetic attraction
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            
            // Add a small inner glow shadow on move
            if(!btn.classList.contains('btn-secondary')) {
                btn.style.boxShadow = `0 15px 35px rgba(184, 151, 62, 0.4)`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            if(!btn.classList.contains('btn-secondary')) {
                btn.style.boxShadow = '';
            }
        });
    });

    // ── 15. Dynamic Treatment Filter ─────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const treatCards = document.querySelectorAll('.treatment-card');
    
    if (filterBtns.length && treatCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                treatCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => card.style.display = 'none', 400);
                    }
                });
            });
        });
    }

    // ── 16. Background Floating Shapes Parallax ──────────────
    const shape1 = document.createElement('div');
    shape1.className = 'parallax-bg-shape shape-1';
    const shape2 = document.createElement('div');
    shape2.className = 'parallax-bg-shape shape-2';
    document.body.appendChild(shape1);
    document.body.appendChild(shape2);

    window.addEventListener('scroll', () => {
        const scrolled = window.window.pageYOffset || document.documentElement.scrollTop;
        shape1.style.transform = `translateY(${scrolled * 0.15}px) rotate(${scrolled * 0.05}deg)`;
        shape2.style.transform = `translateY(${scrolled * -0.1}px) rotate(${scrolled * -0.02}deg)`;
    }, { passive: true });

    // ── 17. Cinematic Image Scale-In ────────────────────────
    const cinImages = document.querySelectorAll('.cinematic-img');
    if (cinImages.length) {
        window.addEventListener('scroll', () => {
            cinImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (inView) {
                    const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const scale = 1.15 - (scrollPercent * 0.15); 
                    img.style.transform = `scale(${Math.max(1, scale)})`;
                }
            });
        }, { passive: true });
    }

    // ── 18. Animated Clinical FAQ ───────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ── 19. Hero Carousel Logic ──────────────────────────────
    const heroSlides = document.querySelectorAll('.carousel-slide');
    const heroDots = document.querySelectorAll('.carousel-dot');
    let heroIndex = 0;
    let heroInterval;

    function showHeroSlide(index) {
        heroSlides.forEach(s => s.classList.remove('active'));
        heroDots.forEach(d => d.classList.remove('active'));
        
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
        heroIndex = index;
    }

    if (heroSlides.length > 0) {
        heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showHeroSlide(i);
                resetHeroTimer();
            });
        });

        function resetHeroTimer() {
            clearInterval(heroInterval);
            heroInterval = setInterval(() => {
                let next = (heroIndex + 1) % heroSlides.length;
                showHeroSlide(next);
            }, 6000);
        }
        resetHeroTimer();
    }

    // ── 20. Tap-to-Glow (Mobile Tactile) ────────────────────
    const clickableEls = document.querySelectorAll('.card, .btn, .faq-header, .filter-btn');
    clickableEls.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.classList.add('tap-glow-active');
        }, { passive: true });
        
        el.addEventListener('touchend', () => {
            setTimeout(() => {
                el.classList.remove('tap-glow-active');
            }, 200);
        }, { passive: true });
    });
    // ── 21. Interactive Timeline Animation ────────────────────
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineContainer = document.querySelector('.credentials-timeline');

    if (timelineItems.length && timelineContainer) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: once revealed, stop observing
                    // timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });

        timelineItems.forEach(item => timelineObserver.observe(item));

        // Progress line animation on scroll
        window.addEventListener('scroll', () => {
            const rect = timelineContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const totalHeight = rect.height;
                const progress = Math.max(0, Math.min(1, (windowHeight * 0.7 - rect.top) / totalHeight));
                timelineProgress.style.height = (progress * 100) + "%";
            }
        }, { passive: true });
    }

    // ── 22. SKIN JOURNEY DIGITAL CONCIERGE ────────────────────
    const conciergeModal   = document.getElementById('concierge-modal');
    const openBtn          = document.getElementById('open-concierge');
    const closeBtn         = document.getElementById('concierge-close');
    const progressFill     = document.getElementById('concierge-progress-fill');
    const stepLabel        = document.getElementById('concierge-step-label');
    const backBtn          = document.getElementById('concierge-back');
    const conciergeNav     = document.getElementById('concierge-nav');

    let currentStep = 1;
    let answers = { concern: null, duration: null, treated: null };

    const recommendations = {
        acne: {
            headline: "Acne & Scar Restoration Protocol",
            text: "Dr. Alam recommends beginning with a Diagnostic Consultation to assess your skin type, acne grade, and scar depth. Your path may include medical-grade topicals, chemical peels, and Advanced Fractional CO₂ Laser Resurfacing for deep scars — with a structured 3–6 month plan for visible, lasting improvement.",
            link: "acne-scars.html"
        },
        pigmentation: {
            headline: "Medical Pigmentation Treatment Plan",
            text: "Dr. Alam recommends a Melasma & Pigmentation Diagnostic to identify the cause — hormonal, sun-induced, or post-inflammatory. Your plan will likely combine prescription-grade products, chemical peels, and Q-Switched Laser Therapy for targeted, safe brightening.",
            link: "pigmentation.html"
        },
        hair: {
            headline: "Hair Loss Diagnosis & Restoration Plan",
            text: "Dr. Alam recommends a Trichoscopy Assessment to determine the root cause of your hair loss. Treatment typically combines medical management, PRP Therapy, and growth factor treatments to stop loss and stimulate regrowth.",
            link: "hair-loss.html"
        },
        "laser-hair": {
            headline: "Precision Laser Hair Removal Protocol",
            text: "Dr. Alam recommends a Skin & Hair Assessment to match the right laser technology to your skin tone and hair type. A personalised multi-session plan will be designed for long-term reduction — face, body, or both.",
            link: "laser-hair-removal.html"
        },
        surgery: {
            headline: "Clinical Skin Surgery Consultation",
            text: "Dr. Alam recommends a Clinical Dermatosurgery Evaluation to assess the lesion — whether mole, skin tag, cyst, or lipoma. Removal is performed with medical-grade precision, minimal scarring, and histopathology if required.",
            link: "dermatosurgery.html"
        },
        clinical: {
            headline: "Medical Dermatology Treatment Plan",
            text: "Dr. Alam recommends a Skin Condition Diagnostic for conditions like psoriasis, eczema, or vitiligo. Dr. Alam focuses on identifying the medical trigger and prescribing evidence-based systemic treatment for long-term control.",
            link: "clinical-dermatology.html"
        }
    };

    function openConcierge() {
        conciergeModal.classList.add('open');
        conciergeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeConcierge() {
        conciergeModal.classList.remove('open');
        conciergeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(resetConcierge, 600);
    }
    function resetConcierge() {
        currentStep = 1;
        answers = { concern: null, duration: null, treated: null };
        showStep(1);
    }
    function updateProgress(step) {
        const pct = step === 'result' ? 100 : ((step - 1) / 3) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (stepLabel) stepLabel.textContent = step === 'result' ? 'Your Personalised Result' : `Step ${step} of 3`;
        if (conciergeNav) conciergeNav.style.display = step > 1 ? 'block' : 'none';
    }
    function showStep(step) {
        document.querySelectorAll('.concierge-step').forEach(s => s.classList.remove('active'));
        const target = step === 'result'
            ? document.getElementById('concierge-result')
            : document.getElementById(`step-${step}`);
        if (target) target.classList.add('active');
        currentStep = step;
        updateProgress(step);
    }
    function buildResult() {
        const rec = recommendations[answers.concern] || recommendations.acne;
        const headline = document.getElementById('result-headline');
        const resultText = document.getElementById('result-text');
        const learnMore = document.getElementById('result-learn-more');
        if (headline) headline.textContent = rec.headline;
        if (resultText) resultText.textContent = rec.text;
        if (learnMore) learnMore.href = rec.link;
        showStep('result');
    }

    if (openBtn) openBtn.addEventListener('click', openConcierge);
    if (closeBtn) closeBtn.addEventListener('click', closeConcierge);
    if (backBtn) backBtn.addEventListener('click', () => {
        if (currentStep === 2) showStep(1);
        else if (currentStep === 3) showStep(2);
        else if (currentStep === 'result') showStep(3);
    });
    if (conciergeModal) {
        conciergeModal.addEventListener('click', (e) => {
            if (e.target === conciergeModal) closeConcierge();
        });
    }

    // Step 1 — Concern selection (auto-advances)
    document.querySelectorAll('.concern-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            answers.concern = btn.dataset.value;
            showStep(2);
        });
    });
    // Step 2 — Duration selection (auto-advances)
    document.querySelectorAll('#step-2 .duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            answers.duration = btn.dataset.value;
            showStep(3);
        });
    });
    // Step 3 — Prior treatment (generates result)
    document.querySelectorAll('#step-3 .duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            answers.treated = btn.dataset.value;
            buildResult();
        });
    });

    const spotlightWrap    = document.getElementById('clinical-spotlight-wrap');
    const spotlightOverlay = document.getElementById('spotlight-overlay');
    const spotlightCircle  = document.getElementById('spotlight-circle');

    if (spotlightWrap && spotlightOverlay) {
        // Desktop interactions
        spotlightWrap.addEventListener('mouseenter', () => spotlightWrap.classList.add('active'));
        spotlightWrap.addEventListener('mouseleave', () => spotlightWrap.classList.remove('active'));

        // Mobile touch start
        spotlightWrap.addEventListener('touchstart', (e) => {
            spotlightWrap.classList.add('active');
            // Prevent scrolling when interacting with spotlight if needed
            // e.preventDefault(); 
        }, { passive: true });

        const annotations = spotlightWrap.querySelectorAll('.clinical-annotation');

        const updateSpotlight = (clientX, clientY) => {
            const rect = spotlightWrap.getBoundingClientRect();
            const relX = clientX - rect.left;
            const relY = clientY - rect.top;
            const xPercent = (relX / rect.width * 100).toFixed(2) + '%';
            const yPercent = (relY / rect.height * 100).toFixed(2) + '%';
            
            spotlightOverlay.style.setProperty('--sx', xPercent);
            spotlightOverlay.style.setProperty('--sy', yPercent);
            
            const radius = window.innerWidth <= 768 ? 100 : 130;

            spotlightOverlay.style.maskImage =
                `radial-gradient(circle ${radius}px at ${xPercent} ${yPercent}, transparent 0%, black 80%)`;
            spotlightOverlay.style.webkitMaskImage =
                `radial-gradient(circle ${radius}px at ${xPercent} ${yPercent}, transparent 0%, black 80%)`;

            if (spotlightCircle) {
                spotlightCircle.style.left = xPercent;
                spotlightCircle.style.top = yPercent;
            }

            // Proximity Logic: Only show the SINGLE closest annotation if "lit" by the spotlight
            let closestAnn = null;
            let minDistance = radius + 50; // Threshold for being "lit"

            annotations.forEach(ann => {
                const annX = ann.offsetLeft;
                const annY = ann.offsetTop;
                const dx = relX - annX;
                const dy = relY - annY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                ann.classList.remove('visible'); // Hide by default

                if (distance < minDistance) {
                    minDistance = distance;
                    closestAnn = ann;
                }
            });

            if (closestAnn) {
                closestAnn.classList.add('visible');
            }
        };

        spotlightWrap.addEventListener('mousemove', (e) => {
            updateSpotlight(e.clientX, e.clientY);
        }, { passive: true });

        spotlightWrap.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    // ── 24. MAGNETIC CONTACT DOCK ──────────────────────────────
    const contactDock = document.getElementById('contact-dock');
    if (contactDock) {
        // Slide up after 2s
        setTimeout(() => contactDock.classList.add('visible'), 2000);

        // Magnetic attraction on dock items
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.28;
                const dy = (e.clientY - cy) * 0.28;
                item.style.transform = `translate(${dx}px, ${dy - 5}px) scale(1.05)`;
                const wrap = item.querySelector('.dock-icon-wrap');
                if (wrap) wrap.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                const wrap = item.querySelector('.dock-icon-wrap');
                if (wrap) wrap.style.transform = '';
            });
        });
    }

    // ── 25. PREMIUM CUSTOM CURSOR ─────────────────────────────
    const cursorDot  = document.querySelector('.cursor-dot');
    const cursorAura = document.querySelector('.cursor-aura');
    
    if (cursorDot && cursorAura) {
        document.addEventListener('mousemove', (e) => {
            // Instant move for dot
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top  = e.clientY + 'px';
            
            // Slightly delayed move for aura using animate or just CSS transition?
            // For max premiumness, we use requestAnimationFrame or smooth transition
            cursorAura.animate({
                left: e.clientX + 'px',
                top: e.clientY + 'px'
            }, { duration: 500, fill: "forwards" });
        }, { passive: true });

        // Hover effect on interactable elements
        const interactables = 'a, button, .card, .stat-item, .faq-header, [data-ba-slider]';
        document.querySelectorAll(interactables).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

});
