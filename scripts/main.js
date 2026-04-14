document.addEventListener('DOMContentLoaded', () => {

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

    // ── Sticky header shadow ──────────────────────────────────
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 10
                ? '0 4px 20px rgba(6,29,48,0.12)'
                : '0 1px 0 rgba(184,151,62,0.15)';
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


    // ── 10. Luxury Spotlight (Hero) ──────────────────────────
    const heroSpot = document.getElementById('hero-spotlight');
    const heroSec  = document.getElementById('hero-section');
    if (heroSpot && heroSec) {
        heroSec.addEventListener('mousemove', (e) => {
            const rect = heroSec.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroSpot.style.left = `${x}px`;
            heroSpot.style.top  = `${y}px`;
        });
    }

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

    // ── 14. Magnetic Buttons ──────────────────────────────────
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button 40% towards cursor
            btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
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

});
