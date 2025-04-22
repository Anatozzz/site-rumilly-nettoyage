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

// Animation de la section hero
const heroAnimation = () => {
    const heroSection = document.querySelector('#accueil');
    const content = heroSection.querySelector('.container');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container absolute inset-0 overflow-hidden';
    heroSection.insertBefore(particlesContainer, content);

    // Création des particules
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle absolute bg-white/20 rounded-full';
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particlesContainer.appendChild(particle);
    }

    // Animation de balayage
    const sweepOverlay = document.createElement('div');
    sweepOverlay.className = 'sweep-overlay absolute inset-0 bg-primary transform -translate-x-full';
    heroSection.insertBefore(sweepOverlay, content);

    // Animation de révélation du contenu
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';

    // Déclenchement des animations
    setTimeout(() => {
        sweepOverlay.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        sweepOverlay.style.transform = 'translateX(100%)';
        
        content.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 300);

    // Animation de brillance sur les boutons
    const buttons = content.querySelectorAll('a.button');
    buttons.forEach(button => {
        const glow = document.createElement('div');
        glow.className = 'glow-effect absolute inset-0 bg-white/20 transform -translate-x-full';
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(glow);

        setInterval(() => {
            glow.style.transition = 'transform 0.8s ease-out';
            glow.style.transform = 'translateX(100%)';
            setTimeout(() => {
                glow.style.transition = 'none';
                glow.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    glow.style.transition = 'transform 0.8s ease-out';
                }, 50);
            }, 1000);
        }, 5000);
    });
};

// Ajout des styles d'animation
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
        }
    }

    .particle {
        pointer-events: none;
    }

    .sweep-overlay {
        z-index: 1;
    }

    .glow-effect {
        pointer-events: none;
        z-index: 1;
    }
`;
document.head.appendChild(animationStyles);

// Initialisation de l'animation
document.addEventListener('DOMContentLoaded', () => {
    heroAnimation();
    // ... existing initialization code ...
});
