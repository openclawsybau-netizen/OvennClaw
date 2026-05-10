document.addEventListener('DOMContentLoaded', () => {
    // GSAP Registration
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

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
            document.querySelector('.loader').style.display = 'none';
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

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from('.about-visual', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    // Hover Effect for Links
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(0, 242, 255, 0.1)', duration: 0.3 });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
        });
    });
});
