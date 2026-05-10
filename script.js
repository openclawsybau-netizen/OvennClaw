document.addEventListener('DOMContentLoaded', () => {
    // GSAP Registration
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        });

        document.querySelectorAll('a, button, .feature-card, .contact-form button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(0, 242, 255, 0.1)', duration: 0.3 });
            });
            el.addEventListener('</strong>mouseleave</strong>', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
            });
        });
    }

    // Hero Animations
    const tl = gsap.timeline();
    tl.from('.hero-content h1', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
    })
    .from('.hero-content p', {
        opacity: 0,
        y: 20,
        duration: 1
    }, '-=1')
    .from('.hero-btns', {
        opacity: 0,
        y: 20,
        duration: 1
    }, '-=0.5')
    .from('.hero-visual .ring', {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: 'expo.out'
    }, '-=1.5');

    // ScrollTrigger Animations
    gsap.utils.toArray('.feature-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    gsap.from('.about-content', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from('.about-visual-container', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from('.contact-card', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
});
