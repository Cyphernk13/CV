document.addEventListener('DOMContentLoaded', function() {

    // --- SOUND & CLICK ANIMATION ---
    // Create synths for click sounds using Tone.js
    const clickSound = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();

    const linkClickSound = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();

    // Function to create the ripple effect on click
    function createClickEffect(e) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        // Position the effect at the cursor's location
        effect.style.top = e.clientY + 'px';
        effect.style.left = e.clientX + 'px';
        document.body.appendChild(effect);

        // Remove the effect after the animation is done
        setTimeout(() => {
            effect.remove();
        }, 400); // Duration matches the animation in CSS
    }

    // Add a single event listener for all clicks on the document
    document.addEventListener('click', function(e) {
        // Start Tone.js audio context on the first user interaction
        Tone.start();

        // Create the visual click effect
        createClickEffect(e);

        // Check if the clicked element or its parent is a link
        if (e.target.closest('a')) {
            // Play a higher-pitched sound for links
            linkClickSound.triggerAttackRelease('G4', '8n');
        } else {
            // Play a standard sound for any other click
            clickSound.triggerAttackRelease('C4', '8n');
        }
    });


    // --- MATRIX ANIMATION ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()';
    const fontSize = 16;
    let columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#64ffda'; // Green color from CSS variables
        ctx.font = fontSize + 'px Roboto Mono';

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const matrixInterval = setInterval(drawMatrix, 40);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = canvas.width / fontSize;
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    });


    // --- TYPING EFFECT ---
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = ["I build things for the web.", "I solve complex problems.", "I love to code."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            const typeSpeed = isDeleting ? 100 : 150;
            setTimeout(type, typeSpeed);
        }
        type();
    }


    // --- RESPONSIVE NAVBAR ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));
    
    // --- HIDE/SHOW NAVBAR ON SCROLL ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            // Downscroll
            navbar.style.top = '-80px';
        } else {
            // Upscroll
            navbar.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });


    // --- REVEAL SECTIONS ON SCROLL ---
    const sections = document.querySelectorAll('.content-section');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});
