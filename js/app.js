// Rapture Twelve - Premium Website JavaScript
// Defense-grade cybersecurity and AI company - MOBILE PERFORMANCE OPTIMIZED

// Initialize GSAP only on desktop
let grapInitialized = false;

// Mobile detection - more comprehensive
function isMobileDevice() {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return mobileRegex.test(userAgent) || isSmallScreen || isTouchDevice;
}

const IS_MOBILE = isMobileDevice();

// Initialize GSAP only for desktop
function initializeGSAP() {
    if (!IS_MOBILE && typeof gsap !== 'undefined' && !grapInitialized) {
        try {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);
            grapInitialized = true;
            console.log('GSAP initialized for desktop');
        } catch (e) {
            console.warn('GSAP initialization failed:', e);
        }
    }
}

// Global variables
let isScrolling = false;
let navInitialized = false;

// Throttle utility function - lighter for mobile
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, IS_MOBILE ? limit * 2 : limit);
        }
    }
}

// Debounce utility function - lighter for mobile
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
        timeout = setTimeout(later, IS_MOBILE ? wait * 2 : wait);
        if (callNow) func.apply(context, args);
    };
}

// Document Ready - Mobile optimized initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Mobile:', IS_MOBILE);
    
    // Initialize GSAP only for desktop
    if (!IS_MOBILE) {
        initializeGSAP();
    }
    
    // Initialize core functionality
    try {
        initializeVideo();
        initializeNavigation();
        initializeContactForm();
        initializeFloatingContact();
        
        if (IS_MOBILE) {
            initializeMobileOptimized();
        } else {
            initializeDesktopAnimations();
            initializeScrollEffects();
            initializeServiceCards();
            initializeParallax();
        }
        
        lazyLoadImages();
        console.log('All features initialized for:', IS_MOBILE ? 'Mobile' : 'Desktop');
    } catch (e) {
        console.error('Initialization failed:', e);
    }
    
    // Initialize scroll functionality
    setTimeout(() => {
        initializeScrollFunctionality();
    }, IS_MOBILE ? 100 : 500);
});

// Mobile-only initialization - NO ANIMATIONS
function initializeMobileOptimized() {
    console.log('Initializing mobile-optimized mode - NO ANIMATIONS');
    
    // Make all elements immediately visible
    const allElements = document.querySelectorAll(`
        [data-reveal], 
        .service-card, 
        .case-study-card, 
        .leader-card, 
        .partners-grid, 
        .certifications, 
        .innovation-showcase, 
        .contact-info, 
        .contact-form-container,
        .section-subtitle,
        #hero-company-name,
        #hero-tagline,
        #hero-subtitle,
        #hero-cta
    `);
    
    allElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.visibility = 'visible';
    });
    
    // Disable any CSS animations on mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                transition-delay: 0ms !important;
            }
            
            .section-subtitle,
            [data-reveal],
            .service-card,
            .case-study-card,
            .leader-card {
                opacity: 1 !important;
                transform: none !important;
                visibility: visible !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Simple intersection observer for any missed elements
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        allElements.forEach(element => {
            if (element.style.opacity !== '1') {
                observer.observe(element);
            }
        });
    }
}

// Desktop-only animations
function initializeDesktopAnimations() {
    if (IS_MOBILE || !grapInitialized) return;
    
    console.log('Initializing desktop animations');
    
    // Hero animations - desktop only
    gsap.set("#hero-company-name", { opacity: 0, scale: 0.9, y: 50 });
    gsap.set("#hero-tagline", { opacity: 0, y: 30 });
    gsap.set("#hero-subtitle", { opacity: 0, y: 30 });
    gsap.set("#hero-cta", { opacity: 0, y: 30 });

    const heroTl = gsap.timeline({ delay: 0.2 });
    
    heroTl
        .to("#hero-company-name", {
            duration: 0.6,
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power3.out"
        })
        .to("#hero-tagline", {
            duration: 0.4,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.4")
        .to("#hero-subtitle", {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.2")
        .to("#hero-cta", {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.1");

    // Typewriter effect for tagline
    gsap.to("#hero-tagline", {
        duration: 1.2,
        text: "INFILTRATE • EXPLOIT • SECURE",
        ease: "none",
        delay: 1.2
    });
}

// Initialize Video
function initializeVideo() {
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.autoplay = true;
        
        // Reduce video quality on mobile for performance
        if (IS_MOBILE) {
            heroVideo.style.transform = 'scale(1.1)';
            heroVideo.style.filter = 'blur(0.5px)';
        }
        
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Hero video started playing');
            }).catch(error => {
                console.error('Video autoplay failed:', error);
                if (!IS_MOBILE) {
                    document.addEventListener('click', function() {
                        heroVideo.play().catch(e => console.error('Manual video play failed:', e));
                    }, { once: true });
                }
            });
        }
    }
}

// Navigation system - optimized for mobile
function initializeNavigation() {
    console.log('Initializing navigation...');

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect - throttled more on mobile
    const scrollHandler = throttle(() => {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }, IS_MOBILE ? 100 : 50);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Navigation link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                smoothScrollToSection(targetSection, navbarHeight);

                // Close mobile menu
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }

                updateActiveNavLink(link, navLinks);
            }
        });
    });

    // Update active nav link on scroll - less frequent on mobile
    const scrollThrottled = throttle(() => {
        updateActiveNavLinkOnScroll(navLinks);
    }, IS_MOBILE ? 200 : 50);
    
    window.addEventListener('scroll', scrollThrottled, { passive: true });
    navInitialized = true;
}

// Smooth scroll function - mobile optimized
function smoothScrollToSection(targetElement, offset = 80) {
    if (!targetElement) return;

    const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    
    // Mobile: Use faster, simpler scroll
    if (IS_MOBILE) {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        } else {
            // Instant scroll for very old mobile browsers
            window.scrollTo(0, targetTop);
        }
        return;
    }
    
    // Desktop: Use GSAP if available
    if (grapInitialized && typeof gsap !== 'undefined') {
        if (gsap.plugins?.ScrollToPlugin) {
            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: targetTop,
                    autoKill: true
                },
                ease: "power2.inOut"
            });
            return;
        }
        
        gsap.to(window, {
            duration: 0.8,
            scrollTop: targetTop,
            ease: "power2.inOut"
        });
        return;
    }
    
    // Fallback
    window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink, allLinks) {
    allLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Update active nav link based on scroll position
function updateActiveNavLinkOnScroll(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    let currentSection = null;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < bottom) {
            currentSection = section.getAttribute('id');
        }
    });

    if (currentSection) {
        const correspondingLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (correspondingLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            correspondingLink.classList.add('active');
        }
    }
}

// Smooth scroll utility
function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    smoothScrollToSection(target, navbarHeight);
}

// Initialize scroll functionality
function initializeScrollFunctionality() {
    console.log('Initializing scroll functionality...');
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    
    anchorLinks.forEach(anchor => {
        if (anchor.hasAttribute('data-scroll-initialized')) return;
        
        anchor.setAttribute('data-scroll-initialized', 'true');
        
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            e.preventDefault();
            e.stopPropagation();
            smoothScrollTo(href);
        });
    });
}

// Scroll effects - DESKTOP ONLY
function initializeScrollEffects() {
    if (IS_MOBILE || !grapInitialized) return;
    
    console.log('Initializing scroll effects for desktop');
    
    const animationDuration = 0.2;
    const staggerTime = 0.05;
    
    // Reveal animations for sections
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    revealElements.forEach(element => {
        gsap.set(element, { opacity: 0, y: 20 });
        
        ScrollTrigger.create({
            trigger: element,
            start: "top 95%",
            onEnter: () => {
                gsap.to(element, {
                    duration: animationDuration,
                    opacity: 1,
                    y: 0,
                    ease: "power1.out"
                });
            }
        });
    });

    // Service cards
    gsap.set(".service-card", { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
        trigger: ".services-grid",
        start: "top 95%",
        onEnter: () => {
            gsap.to(".service-card", {
                duration: animationDuration,
                opacity: 1,
                y: 0,
                stagger: staggerTime,
                ease: "power1.out"
            });
        }
    });

    // Case study cards
    gsap.set(".case-study-card", { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
        trigger: ".case-studies-grid",
        start: "top 95%",
        onEnter: () => {
            gsap.to(".case-study-card", {
                duration: animationDuration,
                opacity: 1,
                y: 0,
                stagger: staggerTime,
                ease: "power1.out"
            });
        }
    });

    // Leader cards
    gsap.set(".leader-card", { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
        trigger: ".leadership-grid",
        start: "top 95%",
        onEnter: () => {
            gsap.to(".leader-card", {
                duration: animationDuration,
                opacity: 1,
                y: 0,
                stagger: staggerTime * 2,
                ease: "power1.out"
            });
        }
    });

    // Partners and certifications
    gsap.set(".partners-grid", { opacity: 0, y: 15 });
    gsap.set(".certifications", { opacity: 0, y: 15 });
    
    ScrollTrigger.create({
        trigger: ".trusted-by",
        start: "top 95%",
        onEnter: () => {
            gsap.to(".partners-grid", {
                duration: animationDuration,
                opacity: 1,
                y: 0,
                ease: "power1.out"
            });
            
            gsap.to(".certifications", {
                duration: animationDuration,
                opacity: 1,
                y: 0,
                ease: "power1.out",
                delay: 0.1
            });
        }
    });

    // Innovation showcase
    gsap.set(".innovation-showcase", { opacity: 0, scale: 0.98 });
    
    ScrollTrigger.create({
        trigger: ".innovation-showcase",
        start: "top 95%",
        onEnter: () => {
            gsap.to(".innovation-showcase", {
                duration: animationDuration * 1.5,
                opacity: 1,
                scale: 1,
                ease: "power1.out"
            });
        }
    });

    // Contact section
    gsap.set(".contact-info", { opacity: 0, x: -20 });
    gsap.set(".contact-form-container", { opacity: 0, x: 20 });
    
    ScrollTrigger.create({
        trigger: ".contact-grid",
        start: "top 95%",
        onEnter: () => {
            gsap.to(".contact-info", {
                duration: animationDuration,
                opacity: 1,
                x: 0,
                ease: "power1.out"
            });
            
            gsap.to(".contact-form-container", {
                duration: animationDuration,
                opacity: 1,
                x: 0,
                ease: "power1.out",
                delay: 0.05
            });
        }
    });
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
        emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey,
        });
        return true;
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return false;
    }
}

// Contact form initialization
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const fileInput = document.getElementById('attachment');

    if (!form) return;

    // Handle file input
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const label = document.querySelector('.file-label');
            if (this.files && this.files[0]) {
                label.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                    </svg>
                    ${this.files[0].name}
                `;
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        
        if (submitButton.disabled) return;
        
        const isConfigured = initializeEmailJS();
        
        if (!isConfigured) {
            showFormStatus('error', 'Email service is not configured yet. Please contact us directly using the phone numbers or email addresses provided.');
            return;
        }
        
        // Show loading state
        submitButton.innerHTML = `
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #00ff88; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            Sending...
        `;
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
                
                const fileLabel = document.querySelector('.file-label');
                if (fileLabel) {
                    fileLabel.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                        </svg>
                        Attach Documentation (Optional)
                    `;
                }
            } else {
                throw new Error(`EmailJS returned status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            
            let errorMessage = 'Failed to send message. Please try again or contact us directly.';
            
            if (error.text) {
                if (error.text.includes('unsupported')) {
                    errorMessage = 'Please update your browser and try again, or contact us directly.';
                } else if (error.text.includes('Invalid template ID')) {
                    errorMessage = 'Email template configuration error. Please contact us directly.';
                } else if (error.text.includes('rate limit')) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                }
            }
            
            showFormStatus('error', errorMessage);
        } finally {
            setTimeout(() => {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }, 1000);
        }
    });

    function showFormStatus(type, message) {
        if (!formStatus) return;
        
        const statusMessage = formStatus.querySelector('.status-message') || formStatus;
        formStatus.className = `form-status ${type}`;
        
        if (statusMessage.tagName === 'DIV') {
            statusMessage.textContent = message;
        } else {
            formStatus.innerHTML = `<div class="status-message">${message}</div>`;
        }
        
        formStatus.style.display = 'block';
        
        // Simple animation for mobile compatibility
        if (!IS_MOBILE && grapInitialized) {
            gsap.fromTo(formStatus, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
            
            if (type !== 'loading') {
                setTimeout(() => {
                    gsap.to(formStatus, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => {
                            formStatus.style.display = 'none';
                        }
                    });
                }, 8000);
            }
        } else {
            formStatus.style.opacity = '1';
            formStatus.style.transform = 'translateY(0)';
            
            if (type !== 'loading') {
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 500);
                }, 8000);
            }
        }
    }
}

// Floating contact button
function initializeFloatingContact() {
    const floatingContact = document.getElementById('floating-contact');
    if (!floatingContact) return;
    
    if (!IS_MOBILE && grapInitialized) {
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
    } else {
        // Simple scroll handler for mobile
        const scrollHandler = throttle(() => {
            if (window.scrollY > 100) {
                floatingContact.classList.add('visible');
            } else {
                floatingContact.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
}

// Service cards interactions - desktop only
function initializeServiceCards() {
    if (IS_MOBILE || !grapInitialized) return;
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.2,
                y: -10,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.2,
                y: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// Parallax effects - desktop only
function initializeParallax() {
    if (IS_MOBILE || !grapInitialized) return;
    
    // Section backgrounds parallax (excluding hero)
    gsap.utils.toArray('.section:not(.hero)').forEach(section => {
        const bg = section.querySelector('.section-bg');
        if (bg) {
            gsap.to(bg, {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        }
    });
}

// Lazy loading images
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
        }, {
            rootMargin: IS_MOBILE ? '50px' : '100px'
        });
        
        images.forEach(image => imageObserver.observe(image));
    }
}

// Contact modal functions - simplified for mobile
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (!IS_MOBILE && grapInitialized) {
        gsap.fromTo('.modal-content',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
        );
    } else {
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
    if (!IS_MOBILE && grapInitialized) {
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Contact scroll function
function scrollToContact() {
    smoothScrollTo('#contact');
}

// CSS for animations and form styling
const additionalCSS = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.form-status {
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    display: none;
    transition: all 0.3s ease;
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

.form-status.loading {
    background: rgba(0, 204, 255, 0.1);
    border: 1px solid #00ccff;
    color: #00ccff;
}

/* Mobile performance optimizations */
@media (max-width: 768px) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0ms !important;
    }
    
    .section-subtitle,
    [data-reveal],
    .service-card,
    .case-study-card,
    .leader-card,
    .partners-grid,
    .certifications,
    .innovation-showcase,
    .contact-info,
    .contact-form-container {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
    }
    
    /* Disable transform-based animations that cause reflows */
    .service-card,
    .case-study-card,
    .leader-card {
        will-change: auto !important;
    }
}

/* Desktop hover effects */
@media (min-width: 769px) {
    .service-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .service-card:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
    }
}
`;

// Inject CSS
function injectCSS() {
    if (!document.getElementById('rapture-optimization-css')) {
        const style = document.createElement('style');
        style.id = 'rapture-optimization-css';
        style.textContent = additionalCSS;
        document.head.appendChild(style);
    }
}

// Initialize all scroll handlers
function initializeAllScrollHandlers() {
    console.log('Initializing comprehensive scroll handlers...');
    
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    
    allAnchorLinks.forEach((anchor, index) => {
        // Remove existing listeners by cloning
        const newAnchor = anchor.cloneNode(true);
        anchor.parentNode.replaceChild(newAnchor, anchor);
        
        newAnchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href || href === '#') return;
            
            e.preventDefault();
            e.stopPropagation();
            
            // Close mobile menu if nav link
            const navToggle = document.getElementById('nav-hamburger');
            const navMenu = document.getElementById('nav-menu');
            if (this.classList.contains('nav-link') && navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            smoothScrollTo(href);
        });
    });
    
    console.log(`Initialized ${allAnchorLinks.length} scroll handlers`);
}

// Performance monitoring
function initializePerformanceMonitoring() {
    if (IS_MOBILE) {
        // Monitor frame rate on mobile
        let lastTime = performance.now();
        let frameCount = 0;
        
        function checkFrameRate() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                console.log('Mobile FPS:', fps);
                
                if (fps < 30) {
                    console.warn('Low FPS detected, applying additional optimizations');
                    applyEmergencyOptimizations();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFrameRate);
        }
        
        requestAnimationFrame(checkFrameRate);
    }
}

// Emergency optimizations for low-end devices
function applyEmergencyOptimizations() {
    console.log('Applying emergency optimizations');
    
    // Disable all remaining animations
    const emergencyCSS = `
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        .hero-video {
            display: none !important;
        }
        
        .hero::before {
            background: #000 !important;
        }
    `;
    
    const emergencyStyle = document.createElement('style');
    emergencyStyle.textContent = emergencyCSS;
    document.head.appendChild(emergencyStyle);
    
    // Kill all GSAP animations if they exist
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf("*");
        ScrollTrigger.killAll();
    }
}

// Preload critical resources
function preloadCriticalResources() {
    if (IS_MOBILE) return; // Skip preloading on mobile to save bandwidth
    
    const criticalImages = [
        'assets/r12-logo.svg',
        'assets/r12-logo-large.svg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });
}

// Analytics and tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Add your analytics implementation here
}

// Track interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .contact-method, .nav-link')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_type: e.target.className
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Service Worker registration for caching (desktop only)
if (!IS_MOBILE && 'serviceWorker' in navigator) {
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

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    injectCSS();
    
    if (IS_MOBILE) {
        console.log('Mobile device detected - performance mode enabled');
        initializePerformanceMonitoring();
    } else {
        console.log('Desktop device detected - full features enabled');
        preloadCriticalResources();
    }
});

// Window load backup initialization
window.addEventListener('load', function() {
    if (!navInitialized) {
        setTimeout(() => {
            initializeAllScrollHandlers();
        }, 200);
    }
});

// Optimized scroll and resize handlers
const optimizedScrollHandler = throttle(() => {
    // Minimal scroll handling for performance
}, IS_MOBILE ? 100 : 16);

const optimizedResizeHandler = debounce(() => {
    if (!IS_MOBILE && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, IS_MOBILE ? 500 : 250);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
window.addEventListener('resize', optimizedResizeHandler);

// Export functions for global access
window.RaptureApp = {
    openContactModal,
    closeContactModal,
    scrollToContact,
    trackEvent,
    smoothScrollTo,
    initializeAllScrollHandlers,
    isMobile: IS_MOBILE
};

// Export scroll utilities
window.RaptureScrollUtils = {
    smoothScrollTo,
    scrollToContact,
    initializeScrollFunctionality: initializeAllScrollHandlers,
    smoothScrollToSection
};

// Debug function
function debugNavigation() {
    console.log('=== Navigation Debug ===');
    console.log('Mobile mode:', IS_MOBILE);
    console.log('Nav initialized:', navInitialized);
    console.log('GSAP initialized:', grapInitialized);
    console.log('Nav links found:', document.querySelectorAll('.nav-link').length);
    console.log('All anchor links:', document.querySelectorAll('a[href^="#"]').length);
    
    const firstSection = document.querySelector('section[id]');
    if (firstSection) {
        console.log('Testing scroll to:', '#' + firstSection.id);
        smoothScrollTo('#' + firstSection.id);
    }
}

window.debugNavigation = debugNavigation;

console.log(`Rapture Twelve JavaScript loaded - ${IS_MOBILE ? 'MOBILE PERFORMANCE MODE' : 'DESKTOP FULL FEATURES'}`);

// Initialize contact form when needed
window.initContactForm = function() {
    injectCSS();
    initializeContactForm();
    initializeEmailJS();
};

// Force immediate visibility for mobile critical elements
if (IS_MOBILE) {
    // Wait for next frame then force visibility
    requestAnimationFrame(() => {
        const criticalElements = document.querySelectorAll(`
            .section-subtitle,
            #hero-company-name,
            #hero-tagline,
            #hero-subtitle,
            #hero-cta,
            [data-reveal],
            .service-card,
            .case-study-card,
            .leader-card
        `);
        
        criticalElements.forEach(element => {
            if (element) {
                element.style.cssText = `
                    opacity: 1 !important;
                    transform: none !important;
                    visibility: visible !important;
                    animation: none !important;
                    transition: none !important;
                `;
            }
        });
    });
}