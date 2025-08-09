// Rapture Twelve - Premium Website JavaScript
// Defense-grade cybersecurity and AI company

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// Global variables
let isScrolling = false;
let tl = gsap.timeline();

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing...');
    
    // Test basic click functionality
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target, 'className:', e.target.className, 'id:', e.target.id);
    });
    
    // Add a simple test to make sure JavaScript is working
    setTimeout(() => {
        console.log('JavaScript is working - 2 seconds after load');
        
        // Test navigation links specifically
        const testNavLinks = document.querySelectorAll('.nav-link');
        console.log('Found nav links:', testNavLinks.length);
        testNavLinks.forEach((link, index) => {
            console.log(`Nav link ${index}:`, link.href, link.textContent);
        });
    }, 2000);
    
    try {
        initializeVideo();
        console.log('Video initialized');
    } catch (e) {
        console.error('Video initialization failed:', e);
    }
    
    try {
        initializeAnimations();
        console.log('Animations initialized');
    } catch (e) {
        console.error('Animations initialization failed:', e);
    }
    
    try {
        initializeNavigation();
        console.log('Navigation initialized');
    } catch (e) {
        console.error('Navigation initialization failed:', e);
    }
    
    try {
        initializeScrollEffects();
        initializeContactForm();
        initializeFloatingContact();
        initializeServiceCards();
        initializeParallax();
        lazyLoadImages();
        console.log('All other features initialized');
    } catch (e) {
        console.error('Other features initialization failed:', e);
    }
});

// Initialize Video
function initializeVideo() {
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Force video to play
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.autoplay = true;
        
        // Try to play the video
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Hero video started playing');
            }).catch(error => {
                console.error('Video autoplay failed:', error);
                // If autoplay fails, try to play on user interaction
                document.addEventListener('click', function() {
                    heroVideo.play().catch(e => console.error('Manual video play failed:', e));
                }, { once: true });
            });
        }
    }
}

// Initialize Hero Animations
function initializeAnimations() {
    // Hero company name and content reveal animation
    gsap.set("#hero-company-name", { opacity: 0, scale: 0.9, y: 50 });
    gsap.set("#hero-tagline", { opacity: 0, y: 30 });
    gsap.set("#hero-subtitle", { opacity: 0, y: 30 });
    gsap.set("#hero-cta", { opacity: 0, y: 30 });

    // Hero sequence animation
    const heroTl = gsap.timeline({ delay: 0.5 });
    
    heroTl
        .to("#hero-company-name", {
            duration: 1.4,
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power3.out"
        })
        .to("#hero-tagline", {
            duration: 0.8,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.8")
        .to("#hero-subtitle", {
            duration: 0.6,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.4")
        .to("#hero-cta", {
            duration: 0.6,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.2");

    // Typewriter effect for tagline
    gsap.to("#hero-tagline", {
        duration: 2,
        text: "INFILTRATE • EXPLOIT • SECURE",
        ease: "none",
        delay: 2.5
    });
}

// Initialize Navigation
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Navigation elements found:', {
        navbar: !!navbar,
        navToggle: !!navToggle,
        navMenu: !!navMenu,
        navLinksCount: navLinks.length
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger menu clicked');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    } else {
        console.error('Mobile menu elements not found');
    }

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Navigation link clicked:', link.getAttribute('href'));
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                console.log('Scrolling to:', targetId, 'offset:', offsetTop);
                
                // Try GSAP scroll, fallback to native scroll
                try {
                    if (typeof gsap !== 'undefined' && gsap.to) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: offsetTop,
                            ease: "power2.inOut"
                        });
                    } else {
                        throw new Error('GSAP not available');
                    }
                } catch (error) {
                    console.log('Using fallback scroll:', error.message);
                    // Fallback to native smooth scroll
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            } else {
                console.error('Target section not found:', targetId);
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

// Initialize Scroll Effects
function initializeScrollEffects() {
    // Reveal animations for sections
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    revealElements.forEach(element => {
        gsap.set(element, { opacity: 0, y: 50 });
        
        ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                gsap.to(element, {
                    duration: 0.8,
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                });
            }
        });
    });

    // Service cards stagger animation
    gsap.set(".service-card", { opacity: 0, y: 50 });
    
    ScrollTrigger.create({
        trigger: ".services-grid",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".service-card", {
                duration: 0.6,
                opacity: 1,
                y: 0,
                stagger: 0.15,
                ease: "power2.out"
            });
        }
    });

    // Case study cards animation
    gsap.set(".case-study-card", { opacity: 0, y: 50 });
    
    ScrollTrigger.create({
        trigger: ".case-studies-grid",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".case-study-card", {
                duration: 0.8,
                opacity: 1,
                y: 0,
                stagger: 0.2,
                ease: "power2.out"
            });
        }
    });

    // Leader cards animation
    gsap.set(".leader-card", { opacity: 0, y: 50 });
    
    ScrollTrigger.create({
        trigger: ".leadership-grid",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".leader-card", {
                duration: 0.8,
                opacity: 1,
                y: 0,
                stagger: 0.3,
                ease: "power2.out"
            });
        }
    });

    // Partners grid animation
    gsap.set(".partners-grid", { opacity: 0, y: 30 });
    gsap.set(".certifications", { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
        trigger: ".trusted-by",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".partners-grid", {
                duration: 0.8,
                opacity: 1,
                y: 0,
                ease: "power2.out"
            });
            
            gsap.to(".certifications", {
                duration: 0.8,
                opacity: 1,
                y: 0,
                ease: "power2.out",
                delay: 0.3
            });
        }
    });

    // Innovation showcase animation
    gsap.set(".innovation-showcase", { opacity: 0, scale: 0.95 });
    
    ScrollTrigger.create({
        trigger: ".innovation-showcase",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".innovation-showcase", {
                duration: 1,
                opacity: 1,
                scale: 1,
                ease: "power2.out"
            });
        }
    });

    // Contact section animation
    gsap.set(".contact-info", { opacity: 0, x: -50 });
    gsap.set(".contact-form-container", { opacity: 0, x: 50 });
    
    ScrollTrigger.create({
        trigger: ".contact-grid",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".contact-info", {
                duration: 0.8,
                opacity: 1,
                x: 0,
                ease: "power2.out"
            });
            
            gsap.to(".contact-form-container", {
                duration: 0.8,
                opacity: 1,
                x: 0,
                ease: "power2.out",
                delay: 0.2
            });
        }
    });
}

// Initialize Contact Form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // For now, use mailto as fallback since no backend is running
            // Replace this with actual API call when backend is set up
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Create mailto link
            const subject = encodeURIComponent(`Cybersecurity Inquiry from ${formDataObj.organization}`);
            const body = encodeURIComponent(
                `Name: ${formDataObj.name}\n` +
                `Organization: ${formDataObj.organization}\n` +
                `Role: ${formDataObj.role || 'N/A'}\n` +
                `Email: ${formDataObj.email}\n` +
                `Phone: ${formDataObj.phone || 'N/A'}\n\n` +
                `Message:\n${formDataObj.message}`
            );
            
            const mailtoLink = `mailto:antonyshane@rapturetwelve.com,kruthinvinay@rapturetwelve.com?subject=${subject}&body=${body}`;
            
            // Open mailto link
            window.location.href = mailtoLink;
            
            showFormStatus('success', 'Opening your email client... Please send the email to complete your inquiry.');
            form.reset();
            
            // Uncomment below when backend is ready:
            /*
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showFormStatus('success', 'Message sent successfully! We will contact you within 24 hours.');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
            */
        } catch (error) {
            console.error('Contact form error:', error);
            showFormStatus('error', 'Failed to send message. Please try calling us directly or email us at the addresses provided.');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    function showFormStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.querySelector('.status-message').textContent = message;
        formStatus.style.display = 'block';
        
        gsap.fromTo(formStatus, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
        
        // Hide after 5 seconds
        setTimeout(() => {
            gsap.to(formStatus, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    formStatus.style.display = 'none';
                }
            });
        }, 5000);
    }
}

// Initialize Floating Contact
function initializeFloatingContact() {
    const floatingContact = document.getElementById('floating-contact');
    
    ScrollTrigger.create({
        trigger: "body",
        start: "top -100",
        end: "bottom bottom",
        onUpdate: (self) => {
            if (self.progress > 0.1) {
                floatingContact.classList.add('visible');
            } else {
                floatingContact.classList.remove('visible');
            }
        }
    });
}

// Service Cards Interactions
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                y: -10,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                y: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// Initialize Parallax Effects
function initializeParallax() {
    // Hero parallax
    gsap.to(".hero-video", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Section backgrounds parallax
    gsap.utils.toArray('.section').forEach(section => {
        const bg = section.querySelector('.section-bg');
        if (bg) {
            gsap.to(bg, {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    });
}

// Lazy Loading Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src || image.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        images.forEach(image => imageObserver.observe(image));
    }
}

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    gsap.fromTo('.modal-content',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    
    gsap.to('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const offsetTop = contactSection.offsetTop - 80;
    
    // Try GSAP scroll, fallback to native scroll
    try {
        gsap.to(window, {
            duration: 1,
            scrollTo: offsetTop,
            ease: "power2.inOut"
        });
    } catch (error) {
        // Fallback to native smooth scroll
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Close modal when clicking outside
document.getElementById('contact-modal').addEventListener('click', (e) => {
    if (e.target.id === 'contact-modal') {
        closeContactModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            
            // Try GSAP scroll, fallback to native scroll
            try {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: offsetTop,
                    ease: "power2.inOut"
                });
            } catch (error) {
                // Fallback to native smooth scroll
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Performance optimizations
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Optimized resize handler
const optimizedResizeHandler = debounce(() => {
    ScrollTrigger.refresh();
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/r12-logo.svg',
        'assets/r12-logo-large.svg',
        'assets/hero-background.webm'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = src.includes('.webm') ? 'video' : 'image';
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Replace with your analytics implementation
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics
    // gtag('event', eventName, eventData);
    
    // Example: Custom analytics
    // analytics.track(eventName, eventData);
}

// Track key interactions
document.addEventListener('click', (e) => {
    // Track button clicks
    if (e.target.matches('.btn, .contact-method, .nav-link')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_type: e.target.className
        });
    }
});

// Track form submissions
document.getElementById('contact-form').addEventListener('submit', () => {
    trackEvent('form_submission', {
        form_type: 'contact'
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Report to error tracking service
});

// Service Worker registration (for caching)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.RaptureApp = {
    openContactModal,
    closeContactModal,
    scrollToContact,
    trackEvent
};
