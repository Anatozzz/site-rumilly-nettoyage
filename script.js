// Configuration AOS
AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: 'ease-in-out'
});

// Menu mobile
const menuButton = document.querySelector('button[aria-label="Ouvrir le menu"]');
const mobileMenu = document.querySelector('nav');
const menuLinks = document.querySelectorAll('nav a');

function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('block');
    const isExpanded = mobileMenu.classList.contains('block');
    menuButton.setAttribute('aria-expanded', isExpanded);
    
    // Animation
    if (isExpanded) {
        mobileMenu.style.animation = 'slideDown 0.3s ease-out';
    } else {
        mobileMenu.style.animation = 'slideUp 0.3s ease-out';
    }
}

menuButton.addEventListener('click', toggleMenu);
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            toggleMenu();
        }
    });
});

// Formulaire interactif
const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea, select');
const successMessage = document.getElementById('success-message');
const loader = document.getElementById('loader');

function validateInput(input) {
    const value = input.value.trim();
    const errorMessage = input.nextElementSibling;
    
    if (!value) {
        input.classList.add('border-red-500');
        if (!errorMessage) {
            const error = document.createElement('p');
            error.className = 'text-red-500 text-sm mt-1';
            error.textContent = 'Ce champ est obligatoire';
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        return false;
    }
    
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        input.classList.add('border-red-500');
        if (!errorMessage) {
            const error = document.createElement('p');
            error.className = 'text-red-500 text-sm mt-1';
            error.textContent = 'Veuillez entrer une adresse email valide';
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        return false;
    }
    
    input.classList.remove('border-red-500');
    if (errorMessage) {
        errorMessage.remove();
    }
    return true;
}

formInputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
        input.classList.remove('border-red-500');
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('text-red-500')) {
            errorMessage.remove();
        }
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    formInputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    loader.classList.remove('hidden');
    try {
        const response = await fetch('/', {
            method: 'POST',
            body: new FormData(contactForm)
        });
        
        if (response.ok) {
            successMessage.style.display = 'block';
            successMessage.style.animation = 'fadeIn 0.5s ease-out';
            contactForm.reset();
            setTimeout(() => {
                successMessage.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 500);
            }, 5000);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire:', error);
    } finally {
        loader.classList.add('hidden');
    }
});

// Carrousel d'avis clients
class TestimonialSlider {
    constructor() {
        this.slider = document.querySelector('.testimonial-slider');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.prevButton = document.querySelector('.slider-prev');
        this.nextButton = document.querySelector('.slider-next');
        this.currentIndex = 0;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.updateSlider();
        this.setupEventListeners();
        this.startAutoSlide();
    }
    
    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - this.currentIndex)}%)`;
            slide.style.opacity = index === this.currentIndex ? '1' : '0';
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
    }
    
    startAutoSlide() {
        setInterval(() => this.nextSlide(), 5000);
    }
}

// Bouton retour en haut
const scrollToTopButton = document.createElement('button');
scrollToTopButton.className = 'fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full opacity-0 transition-opacity duration-300 hover:bg-secondary';
scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopButton.setAttribute('aria-label', 'Retour en haut');
document.body.appendChild(scrollToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.style.opacity = '1';
    } else {
        scrollToTopButton.style.opacity = '0';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialisation du slider
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
});

// Styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .testimonial-slide {
        transition: transform 0.5s ease, opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// Animation de la section hero avec GSAP
const heroAnimation = () => {
    const heroSection = document.querySelector('#accueil');
    const content = heroSection.querySelector('.container');
    
    // Création des particules
    const createParticles = () => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container absolute inset-0 overflow-hidden pointer-events-none';
        heroSection.insertBefore(particlesContainer, content);

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle absolute bg-white/20 rounded-full';
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particlesContainer.appendChild(particle);

            // Animation GSAP des particules
            gsap.to(particle, {
                y: -100,
                x: Math.random() * 50 - 25,
                opacity: 0,
                duration: Math.random() * 3 + 2,
                repeat: -1,
                delay: Math.random() * 2,
                ease: "none"
            });
        }
    };

    // Animation de balayage
    const createSweepEffect = () => {
        const sweepOverlay = document.createElement('div');
        sweepOverlay.className = 'sweep-overlay absolute inset-0 bg-primary transform -translate-x-full';
        heroSection.insertBefore(sweepOverlay, content);

        gsap.to(sweepOverlay, {
            x: "100%",
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => sweepOverlay.remove()
        });
    };

    // Animation du contenu
    const animateContent = () => {
        const elements = content.querySelectorAll('*');
        
        gsap.set(elements, { opacity: 0, y: 20 });
        
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.5
        });
    };

    // Animation de brillance sur les boutons
    const addButtonGlow = () => {
        const buttons = content.querySelectorAll('a.button');
        
        buttons.forEach(button => {
            const glow = document.createElement('div');
            glow.className = 'glow-effect absolute inset-0 bg-white/20 transform -translate-x-full';
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(glow);

            gsap.to(glow, {
                x: "100%",
                duration: 0.8,
                ease: "power2.inOut",
                repeat: -1,
                repeatDelay: 4,
                yoyo: true
            });
        });
    };

    // Initialisation des animations
    createParticles();
    createSweepEffect();
    animateContent();
    addButtonGlow();
};

// Ajout des styles d'animation
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .particles-container {
        z-index: 1;
    }

    .sweep-overlay {
        z-index: 2;
    }

    .glow-effect {
        pointer-events: none;
        z-index: 1;
    }

    /* Animation de brillance sur les titres */
    .hero-title {
        position: relative;
        overflow: hidden;
    }

    .hero-title::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        animation: shine 3s infinite;
    }

    @keyframes shine {
        0% { left: -100%; }
        20% { left: 100%; }
        100% { left: 100%; }
    }
`;
document.head.appendChild(animationStyles);

// Styles pour les témoignages
const testimonialsStyles = document.createElement('style');
testimonialsStyles.textContent = `
    .testimonials-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 1rem;
    }

    .testimonial-bubble {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .testimonial-bubble.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .avatar-circle {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .bubble-content {
        position: relative;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .bubble-content:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .bubble-arrow {
        position: absolute;
        left: -0.5rem;
        top: 1.5rem;
        width: 0;
        height: 0;
        border-top: 0.5rem solid transparent;
        border-bottom: 0.5rem solid transparent;
        border-right: 0.5rem solid white;
    }

    @media (max-width: 768px) {
        .testimonials-container {
            grid-template-columns: 1fr;
        }
        
        .testimonial-bubble {
            margin-bottom: 2rem;
        }
    }

    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 0.9;
            transform: scale(1.05);
        }
        80% {
            opacity: 1;
            transform: scale(0.95);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(testimonialsStyles);

// Animation des témoignages
const animateTestimonials = () => {
    const testimonials = document.querySelectorAll('.testimonial-bubble');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    testimonials.forEach(testimonial => {
        observer.observe(testimonial);
    });
};

// Initialisation des animations
document.addEventListener('DOMContentLoaded', () => {
    heroAnimation();
    animateTestimonials();
    // ... existing initialization code ...
});

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });
        
        // Fermer le menu quand on clique sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Smooth scrolling pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Gestion du formulaire de contact
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const loader = document.getElementById('loader');
    const successMessage = document.getElementById('success-message');
    
    if (loader) loader.classList.remove('hidden');
    
    fetch('/', {
        method: 'POST',
        body: new FormData(form)
    })
    .then(() => {
        if (loader) loader.classList.add('hidden');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        }
    })
    .catch(() => {
        if (loader) loader.classList.add('hidden');
        alert('Une erreur est survenue lors de l\'envoi du formulaire.');
    });
});
