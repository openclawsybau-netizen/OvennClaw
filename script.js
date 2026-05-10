document.addEventListener('DOMContentLoaded', () => {
    // GSAP Registration
    gsap.registerPlugin(ScrollTrigger);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Animate hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                gsap.to(spans[0], { rotate: 45, y: 8, duration: 0.3 });
                gsap.to(spans[1], { rotate: -45, y: -8, duration: 0.3 });
            } else {
                gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { rotate: 0, y: 0, duration: 0.3 });
            }
        });

        // Close menu when link clicked
        navSD = navMenu.querySelectorAll('a');
        navSD.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { rotate: 0, y: 0, duration: 0.3 });
            });
        });
    }

    // Custom Cursor (Only for non-touch devices)
    const cursor = document.querySelector('.cursor');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (cursor && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .service-item');
        interactive  = interactiveElements;
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(0, 242, 255, 0.1)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
            });
        });
    }

    // Loader Animation
    const tl = gsap.timeline();
    tl.to('.progress', {
        width: '100%',
        duration: 2,
        ease: 'power4.inOut'
    })
    .to('.loader-content', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'none';
        }
    })
    .from('nav', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-content h1', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
    }, '-=0.5')
    .from('.hero-content p, .hero-cta', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    }, '-=1');

    // Scroll Animations
    gsap.utils.toArray('.feature-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.service-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from('.about-visual', {
        trigger: '.about',
        start: 'top 70%',
        x: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    // Form Submission Placeholder
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerText = 'Message Sent! ✅';
                btn.style.borderColor = '#00ff88';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.borderColor = '';
                }, 3000);
            }, 2000);
        });
    }
});
