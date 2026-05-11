document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Text Animation
    gsap.from('.hero-title', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: 'power4.out'
    });

    gsap.from('.hero-subtitle', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        delay: 0.5,
        ease: 'power4.out'
    });

    // 2. Feature Cards Scroll Animation
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features',
            start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // 3. Orbital Physics Animation
    const planet = document.getElementById('planet');
    const moon = document.getElementById('moon');
    const container = document.querySelector('.orbit-container');

    let angle = 0;
    function animateOrbit() {
        angle += 0.02;
        const radius = 125;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        gsap.set(planet, { x: x, y: y });

        // Moon orbits the planet
        const moonAngle = angle * 3;
        const moonRadius = 30;
        const mx = Math.cos(moonAngle) * moonRadius;
        const my = Math.sin(moonAngle) * moonRadius;
        
        gsap.set(moon, { x: x + mx, y: y + my });

        requestAnimationFrame(animateOrbit);
    }
    animateOrbit();

    // 4. Background Parallax Effect
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPs = (clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to('.background-particles', {
            duration: 1,
            x: xPos,
            y: yPs,
            ease: 'power2.out'
        });
    });

    // 5. Glitch Effect on Hover
    const glitchText = document.querySelector('.glitch-text');
    glitchText.addEventListener('mouseenter', () => {
        gsap.to(glitchText, {
            duration: 0.1,
            skewX: 20,
            repeat: 5,
            yoyo: true,
            ease: 'rough'
        });
    });
});
