// Rapture Twelve - Clean Navigation System
// Simple, reliable, and performant

// Global state
let isInitialized = false;

// Simple mobile detection
function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Simple smooth scroll function
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) {
        console.warn('Target not found:', targetId);
        return;
    }
    
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Initialize navigation
function initializeNavigation() {
    console.log('Initializing navigation system...');
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Close mobile menu
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll
                smoothScrollTo(href);
            }
        });
    });
    
    // Handle all other anchor links
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (href && href !== '#') {
                smoothScrollTo(href);
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    
    console.log('Navigation initialized successfully');
}

// Update active navigation link based on scroll position
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;
    
    let currentSection = null;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < bottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize video
function initializeVideo() {
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.autoplay = true;
        
        // Move video up more to show the bottom content
        heroVideo.style.objectFit = 'cover';
        heroVideo.style.objectPosition = 'center top';
        heroVideo.style.transform = 'translateY(-25%)';
        
        heroVideo.play().catch(error => {
            console.log('Video autoplay failed:', error);
        });
    }
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: '7gP0EuJ9W_c2z1tE5',
    serviceId: 'service_9zn6fvt',
    templateId: 'template_kpwbdec'
};

// Initialize EmailJS
function initializeEmailJS() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
            return true;
        }
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }
    return false;
}

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        if (submitButton.disabled) return;
        
        // Check EmailJS
        if (!initializeEmailJS()) {
            showFormStatus('error', 'Email service unavailable. Please contact us directly.');
            return;
        }
        
        // Show loading
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(form);
            
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                organization: formData.get('organization'),
                role: formData.get('role') || 'Not specified',
                phone: formData.get('phone') || 'Not provided',
                message: formData.get('message'),
                to_name: 'Rapture Twelve Team',
                reply_to: formData.get('email'),
                subject: `Cybersecurity Inquiry from ${formData.get('organization')}`
            };
            
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );
            
            if (response.status === 200) {
                showFormStatus('success', 'Message sent successfully! We will contact you within 24 hours.');
                form.reset();
            } else {
                throw new Error('Failed to send email');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            showFormStatus('error', 'Failed to send message. Please try again or contact us directly.');
        } finally {
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1000);
        }
    });
}

// Show form status
function showFormStatus(type, message) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;
    
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    if (type !== 'loading') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

// Floating contact button
function initializeFloatingContact() {
    const floatingContact = document.getElementById('floating-contact');
    if (!floatingContact) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            floatingContact.classList.add('visible');
        } else {
            floatingContact.classList.remove('visible');
        }
    }, { passive: true });
}

// Hero animations - the cool entrance effect
function initializeHeroAnimations() {
    console.log('Initializing hero animations...');
    
    // Always animate on both mobile and desktop
    const heroElements = ['#hero-company-name', '#hero-tagline', '#hero-subtitle', '#hero-cta'];
    
    // If GSAP is available, use it for smooth animations
    if (typeof gsap !== 'undefined') {
        try {
            console.log('GSAP detected, initializing premium animations...');
            
            // Initialize GSAP plugins
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
            if (typeof TextPlugin !== 'undefined') {
                gsap.registerPlugin(TextPlugin);
            }
            
            // Set initial animation states
            gsap.set("#hero-company-name", { opacity: 0, scale: 0.9, y: 50 });
            gsap.set("#hero-tagline", { opacity: 0, y: 30 });
            gsap.set("#hero-subtitle", { opacity: 0, y: 30 });
            gsap.set("#hero-cta", { opacity: 0, y: 30 });
            
            // Hero animation timeline - faster on mobile
            const duration = isMobile() ? 0.4 : 0.6;
            const heroTimeline = gsap.timeline({ delay: 0.3 });
            
            heroTimeline
                .to("#hero-company-name", {
                    duration: duration * 1.3,
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    ease: "power3.out"
                })
                .to("#hero-tagline", {
                    duration: duration,
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                }, "-=0.3")
                .to("#hero-subtitle", {
                    duration: duration,
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                }, "-=0.2")
                .to("#hero-cta", {
                    duration: duration,
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                }, "-=0.1");
            
            // Cool typewriter effect for tagline - works on mobile too
            if (typeof TextPlugin !== 'undefined') {
                setTimeout(() => {
                    const taglineElement = document.querySelector("#hero-tagline");
                    if (taglineElement) {
                        gsap.to("#hero-tagline", {
                            duration: isMobile() ? 1.2 : 1.8,
                            text: "INFILTRATE • EXPLOIT • SECURE",
                            ease: "none",
                            delay: 0.2
                        });
                    }
                }, 800);
            }
            
            console.log('Hero animations initialized successfully');
            
        } catch (error) {
            console.warn('GSAP hero animations failed, using fallback:', error);
            fallbackHeroAnimation();
        }
    } else {
        console.log('GSAP not available, using fallback animations');
        fallbackHeroAnimation();
    }
}

// Fallback hero animation without GSAP - works on mobile
function fallbackHeroAnimation() {
    console.log('Using fallback hero animations...');
    
    const heroElements = [
        { selector: '#hero-company-name', delay: 300 },
        { selector: '#hero-tagline', delay: 600 },
        { selector: '#hero-subtitle', delay: 800 },
        { selector: '#hero-cta', delay: 1000 }
    ];
    
    heroElements.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector);
        if (element) {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Animate in
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    });
    
    // Simple typewriter effect fallback - mobile friendly
    setTimeout(() => {
        const tagline = document.querySelector('#hero-tagline');
        if (tagline) {
            const text = "INFILTRATE • EXPLOIT • SECURE";
            tagline.textContent = "";
            let i = 0;
            const speed = isMobile() ? 120 : 100; // Slightly slower on mobile for better effect
            const typeInterval = setInterval(() => {
                tagline.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, speed);
        }
    }, 1200);
}

// Mobile-friendly scroll animations
function initializeMobileAnimations() {
    console.log('Initializing mobile animations...');
    
    // Simple CSS-based animations for mobile
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile animation classes */
        @media (max-width: 768px) {
            .mobile-fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .mobile-fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .service-card, .case-study-card, .leader-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .service-card:active, .case-study-card:active, .leader-card:active {
                transform: scale(0.98);
            }
            
            /* Pulse effect for floating contact */
            .floating-contact.visible {
                animation: mobilePulse 2s infinite;
            }
            
            @keyframes mobilePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* Subtle hover effects for mobile */
            .btn:active {
                transform: scale(0.95);
                transition: transform 0.1s ease;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add mobile animation classes to elements
    const animatedElements = document.querySelectorAll('[data-reveal], .service-card, .case-study-card, .leader-card');
    
    animatedElements.forEach(element => {
        element.classList.add('mobile-fade-in');
    });
    
    // Intersection observer for mobile animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add touch feedback
    document.addEventListener('touchstart', (e) => {
        if (e.target.matches('.btn, .contact-method, .service-card, .case-study-card')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (e.target.matches('.btn, .contact-method, .service-card, .case-study-card')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
}

// Enhanced scroll animations for desktop
function initializeScrollAnimations() {
    if (typeof gsap === 'undefined') return;
    
    try {
        console.log('Initializing desktop scroll animations...');
        
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Staggered animations for service cards
        gsap.set(".service-card", { opacity: 0, y: 50, scale: 0.9 });
        
        ScrollTrigger.create({
            trigger: ".services-grid",
            start: "top 85%",
            onEnter: () => {
                gsap.to(".service-card", {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }
        });
        
        // Case study cards with slide effect
        gsap.set(".case-study-card", { opacity: 0, x: -50 });
        
        ScrollTrigger.create({
            trigger: ".case-studies-grid",
            start: "top 85%",
            onEnter: () => {
                gsap.to(".case-study-card", {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: "power2.out"
                });
            }
        });
        
        // Leader cards with scale effect
        gsap.set(".leader-card", { opacity: 0, scale: 0.8 });
        
        ScrollTrigger.create({
            trigger: ".leaders-grid",
            start: "top 85%",
            onEnter: () => {
                gsap.to(".leader-card", {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        // Section reveals with different effects
        const revealElements = document.querySelectorAll('[data-reveal]');
        revealElements.forEach(element => {
            gsap.set(element, { opacity: 0, y: 30 });
            
            ScrollTrigger.create({
                trigger: element,
                start: "top 90%",
                onEnter: () => {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                }
            });
        });
        
    } catch (error) {
        console.warn('Desktop scroll animations failed:', error);
    }
}

// Modal functions
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll to contact
function scrollToContact() {
    smoothScrollTo('#contact');
}

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Add CSS for form status
function injectFormCSS() {
    const css = `
        .form-status {
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
            font-size: 14px;
        }
        
        .form-status.success {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            color: #00ff88;
        }
        
        .form-status.error {
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid #ff4444;
            color: #ff4444;
        }
        
        .floating-contact {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .floating-contact.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .floating-btn {
            background: linear-gradient(135deg, #00ff88, #00ccff);
            color: #000;
            border: none;
            padding: 12px 20px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
            transition: all 0.3s ease;
        }
        
        .floating-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 255, 136, 0.4);
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .modal-header h3 {
            color: #00ff88;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            padding: 5px;
        }
        
        .contact-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .contact-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 8px;
            color: #fff;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .contact-option:hover {
            background: rgba(0, 255, 136, 0.2);
            transform: translateY(-2px);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .floating-contact {
                bottom: 20px;
                right: 20px;
            }
            
            .modal-content {
                width: 95%;
                padding: 20px;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Initialize everything
function initialize() {
    if (isInitialized) return;
    
    console.log('Initializing Rapture Twelve website...');
    
    try {
        injectFormCSS();
        initializeNavigation();
        initializeVideo();
        initializeContactForm();
        initializeFloatingContact();
        initializeLazyLoading();
        
        // Initialize hero animations immediately
        setTimeout(() => {
            initializeHeroAnimations();
        }, 100);
        
        // Only add scroll animations on desktop if GSAP is available
        if (!isMobile() && typeof gsap !== 'undefined') {
            setTimeout(() => {
                initializeScrollAnimations();
            }, 200);
        }
        
        isInitialized = true;
        console.log('Website initialized successfully');
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Handle clicks outside mobile menu
document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-hamburger');
    
    if (navMenu && navToggle && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Handle modal clicks
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contact-modal');
    if (modal && e.target === modal) {
        closeContactModal();
    }
});

// Escape key handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
        
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-hamburger');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// DOM ready initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Backup initialization
window.addEventListener('load', () => {
    if (!isInitialized) {
        setTimeout(initialize, 100);
    }
});

// Global functions for buttons and links
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.scrollToContact = scrollToContact;

// Debug function
window.testNavigation = function() {
    console.log('Testing navigation...');
    console.log('Available sections:', Array.from(document.querySelectorAll('section[id]')).map(s => s.id));
    console.log('Nav links:', Array.from(document.querySelectorAll('.nav-link')).map(l => l.getAttribute('href')));
    
    // Test scroll to first section
    const firstSection = document.querySelector('section[id]');
    if (firstSection) {
        console.log('Testing scroll to:', firstSection.id);
        smoothScrollTo('#' + firstSection.id);
    }
};

console.log('Rapture Twelve JavaScript loaded successfully');