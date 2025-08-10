// Rapture Twelve - Premium Website JavaScript
// Defense-grade cybersecurity and AI company - FIXED NAVIGATION

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// Global variables
let isScrolling = false;
let tl = gsap.timeline();
let navInitialized = false;

// Throttle utility function
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

// Debounce utility function
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
    
    // Initialize scroll functionality as backup
    setTimeout(() => {
        initializeScrollFunctionality();
    }, 100);
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

// FIXED NAVIGATION SYSTEM
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
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
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
    }

    // Navigation link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const targetId = link.getAttribute('href');
            console.log('Navigation link clicked:', targetId);

            if (!targetId || !targetId.startsWith('#')) {
                console.error('Invalid target ID:', targetId);
                return;
            }

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                smoothScrollToSection(targetSection, navbarHeight);

                // Close mobile menu if open
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }

                // Update active nav link
                updateActiveNavLink(link, navLinks);
            } else {
                console.error('Target section not found:', targetId);
            }
        });
    });

    // Update active nav link on scroll
    const scrollThrottled = throttle(() => {
        updateActiveNavLinkOnScroll(navLinks);
    }, 50);
    

    window.addEventListener('scroll', scrollThrottled);
    
    navInitialized = true;
}

// IMPROVED: Smooth scroll function with multiple fallbacks
function smoothScrollToSection(targetElement, offset = 80) {
    if (!targetElement) {
        console.error('Target element not provided');
        return;
    }

    const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    
    console.log('Smooth scrolling to position:', targetTop);
    
    // Method 1: Try GSAP ScrollToPlugin (most reliable)
    if (typeof gsap !== 'undefined' && gsap.plugins?.ScrollToPlugin) {
        console.log('Using GSAP ScrollTo');
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: targetTop,
                autoKill: true
            },
            ease: "power2.inOut",
            onComplete: () => console.log('GSAP scroll complete')
        });
        return;
    }
    
    // Method 2: Try GSAP basic scroll (fallback)
    if (typeof gsap !== 'undefined') {
        console.log('Using GSAP basic scroll');
        gsap.to(window, {
            duration: 1.2,
            scrollTop: targetTop,
            ease: "power2.inOut",
            onComplete: () => console.log('GSAP basic scroll complete')
        });
        return;
    }
    
    // Method 3: Modern browser smooth scroll
    if ('scrollBehavior' in document.documentElement.style) {
        console.log('Using native smooth scroll');
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
        return;
    }
    
    // Method 4: Animated scroll fallback for older browsers
    console.log('Using animated scroll fallback');
    animatedScrollTo(targetTop);
}

// Animated scroll fallback for older browsers
function animatedScrollTo(targetY, duration = 1000) {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
        window.scrollTo(0, startY + difference * ease);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            console.log('Animated scroll complete');
        }
    }
    
    requestAnimationFrame(step);
}

// Update active navigation link
function updateActiveNavLink(activeLink, allLinks) {
    allLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Update active nav link based on scroll position
function updateActiveNavLinkOnScroll(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150; // Offset for better detection

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

// FIXED: Universal smooth scroll function
function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) {
        console.error('Target not found:', targetSelector);
        return;
    }

    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    smoothScrollToSection(target, navbarHeight);
}

// FIXED: Initialize all scroll functionality
function initializeScrollFunctionality() {
    console.log('Initializing scroll functionality...');
    
    // Remove any existing event listeners to prevent duplicates
    const existingListeners = document.querySelectorAll('[data-scroll-initialized]');
    existingListeners.forEach(el => el.removeAttribute('data-scroll-initialized'));
    
    // Add scroll functionality to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    
    anchorLinks.forEach(anchor => {
        // Skip if already initialized
        if (anchor.hasAttribute('data-scroll-initialized')) {
            return;
        }
        
        anchor.setAttribute('data-scroll-initialized', 'true');
        
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hrefs or just "#"
            if (!href || href === '#') {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Anchor clicked:', href);
            smoothScrollTo(href);
        });
    });
    
    console.log(`Initialized scroll for ${anchorLinks.length} anchor links`);
}

// Contact scroll function
function scrollToContact() {
    smoothScrollTo('#contact');
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

// EmailJS Configuration
// Replace these with your actual EmailJS credentials after setup
const EMAILJS_CONFIG = {
    publicKey: '7gP0EuJ9W_c2z1tE5', 
    serviceId: 'service_9zn6fvt', 
    templateId: 'template_kpwbdec' 
};

// Initialize EmailJS - Updated for new SDK version
function initializeEmailJS() {
    try {
        // New way to initialize EmailJS
        emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey,
        });
        console.log('EmailJS initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return false;
    }
}

// Alternative: Add a fallback reset function
function resetSubmitButton(submitButton, originalHTML) {
    try {
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
        console.log('Button reset successfully');
    } catch (error) {
        console.error('Error resetting button:', error);
        // Force reset as fallback
        submitButton.textContent = 'Send Secure Message';
        submitButton.disabled = false;
    }
}

// Updated form submission handler with better error handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const fileInput = document.getElementById('attachment');

    if (!form) {
        console.log('Contact form not found');
        return;
    }

    // Handle file input display
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
            } else {
                label.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                    </svg>
                    Attach Documentation (Optional)
                `;
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        
        // Prevent double submissions
        if (submitButton.disabled) {
            return;
        }
        
        // Check if EmailJS is configured
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
            // Get form data
            const formData = new FormData(form);
            
            // Prepare template parameters for EmailJS
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

            // Send email using EmailJS - Updated method
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );

            console.log('EmailJS response:', response);
            
            if (response.status === 200) {
                showFormStatus('success', 'Message sent successfully! We will contact you within 24 hours.');
                form.reset();
                
                // Reset file input label
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
            
            // Handle specific EmailJS errors
            if (error.text) {
                if (error.text.includes('unsupported')) {
                    errorMessage = 'Please update your browser and try again, or contact us directly.';
                } else if (error.text.includes('Invalid template ID')) {
                    errorMessage = 'Email template configuration error. Please contact us directly.';
                } else if (error.text.includes('Invalid service ID')) {
                    errorMessage = 'Email service configuration error. Please contact us directly.';
                } else if (error.text.includes('Invalid public key')) {
                    errorMessage = 'Email configuration error. Please contact us directly.';
                } else if (error.text.includes('rate limit')) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                }
            }
            
            showFormStatus('error', errorMessage);
        } finally {
            // Enhanced button reset with fallback
            console.log('Resetting button state...');
            resetSubmitButton(submitButton, originalHTML);
            
            // Additional safety net - force reset after a short delay
            setTimeout(() => {
                if (submitButton.disabled) {
                    console.log('Button still disabled, forcing reset...');
                    resetSubmitButton(submitButton, originalHTML);
                }
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
        
        // Animate if GSAP is available
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(formStatus, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            
            // Hide after 8 seconds for success/error messages
            if (type !== 'loading') {
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
                }, 8000);
            }
        } else {
            // Fallback without GSAP
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

// CSS for spinning animation
const spinnerCSS = `
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
`;

// Inject CSS if not already present
function injectSpinnerCSS() {
    if (!document.getElementById('contact-form-css')) {
        const style = document.createElement('style');
        style.id = 'contact-form-css';
        style.textContent = spinnerCSS;
        document.head.appendChild(style);
    }
}

// Alternative initialization for manual calling
function initContactForm() {
    injectSpinnerCSS();
    initializeContactForm();
    initializeEmailJS();
}

// Initialize Floating Contact
function initializeFloatingContact() {
    const floatingContact = document.getElementById('floating-contact');
    
    if (!floatingContact) return;
    
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
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
        gsap.to(heroVideo, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

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
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    gsap.fromTo('.modal-content',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
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

// Enhanced scroll system - register ScrollToPlugin properly
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
}

// MAIN SCROLL FUNCTION - handles all scroll requests
function smoothScrollTo(targetSelector) {
    console.log('smoothScrollTo called with:', targetSelector);
    
    const target = document.querySelector(targetSelector);
    if (!target) {
        console.error('Target not found:', targetSelector);
        return;
    }

    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    
    console.log('Scrolling to:', targetSelector, 'position:', targetTop);

    // Method 1: GSAP ScrollToPlugin (preferred)
    if (typeof gsap !== 'undefined' && gsap.plugins?.ScrollToPlugin) {
        console.log('Using GSAP ScrollTo plugin');
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: targetTop,
                autoKill: true
            },
            ease: "power2.inOut"
        });
        return;
    }

    // Method 2: GSAP basic animation - try multiple targets
    if (typeof gsap !== 'undefined') {
        console.log('Using GSAP basic scroll');
        
        // Try animating window first
        gsap.to(window, {
            duration: 1,
            scrollTo: targetTop,
            ease: "power2.inOut",
            onComplete: () => console.log('Window scroll complete')
        });
        
        // Backup: also try document elements
        gsap.to([document.documentElement, document.body], {
            duration: 1,
            scrollTop: targetTop,
            ease: "power2.inOut"
        });
        return;
    }

    // Method 3: Native smooth scroll - FORCE it to work
    console.log('Using native smooth scroll - FORCING');
    
    // Try multiple methods to ensure it works
    try {
        window.scrollTo({
            top: targetTop,
            left: 0,
            behavior: 'smooth'
        });
    } catch (e) {
        console.log('Native smooth scroll failed, trying instant scroll');
        window.scrollTo(0, targetTop);
    }
    
    // Backup: also try on document
    try {
        document.documentElement.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    } catch (e) {
        console.log('Document scroll failed');
    }
    
    return;

    // Method 4: Fallback animation
    console.log('Using fallback scroll animation');
    animatedScrollTo(targetTop);
}

// Initialize comprehensive scroll handling
function initializeAllScrollHandlers() {
    console.log('Initializing comprehensive scroll handlers...');
    
    // Handle ALL anchor links (including nav links)
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    
    allAnchorLinks.forEach((anchor, index) => {
        // Remove existing listeners
        const newAnchor = anchor.cloneNode(true);
        anchor.parentNode.replaceChild(newAnchor, anchor);
        
        newAnchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hrefs
            if (!href || href === '#') {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`Anchor ${index} clicked:`, href);
            
            // Close mobile menu if this is a nav link
            const navToggle = document.getElementById('nav-hamburger');
            const navMenu = document.getElementById('nav-menu');
            if (this.classList.contains('nav-link') && navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Perform smooth scroll
            smoothScrollTo(href);
        });
    });
    
    console.log(`Initialized ${allAnchorLinks.length} scroll handlers`);
}

// Contact scroll shortcut function
function scrollToContact() {
    console.log('scrollToContact called');
    smoothScrollTo('#contact');
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'contact-modal') {
                closeContactModal();
            }
        });
    }
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

// Initialize all scroll functionality on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM ready - initializing all scroll functionality');
    
    // Wait for other scripts to load
    setTimeout(() => {
        initializeAllScrollHandlers();
        console.log('All scroll handlers initialized');
    }, 100);
    
    // Inject CSS for forms
    injectSpinnerCSS();
});

// Also initialize on window load (backup)
window.addEventListener('load', function() {
    console.log('Window loaded - backup scroll initialization');
    if (!navInitialized) {
        setTimeout(() => {
            initializeAllScrollHandlers();
        }, 200);
    }
});

// Optimized scroll handler for performance
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations here if needed
}, 8); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Optimized resize handler
const optimizedResizeHandler = debounce(() => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 200);


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
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('form_submission', {
                form_type: 'contact'
            });
        });
    }
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
    trackEvent,
    smoothScrollTo,
    initializeAllScrollHandlers
};

// Export scroll utilities for global access
window.RaptureScrollUtils = {
    smoothScrollTo,
    scrollToContact,
    initializeScrollFunctionality: initializeAllScrollHandlers,
    smoothScrollToSection
};

// Debug function to test navigation
function debugNavigation() {
    console.log('=== Navigation Debug ===');
    console.log('Nav initialized:', navInitialized);
    console.log('Nav links found:', document.querySelectorAll('.nav-link').length);
    console.log('All anchor links:', document.querySelectorAll('a[href^="#"]').length);
    console.log('GSAP available:', typeof gsap !== 'undefined');
    console.log('ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');
    console.log('ScrollToPlugin available:', typeof gsap !== 'undefined' && gsap.plugins?.ScrollToPlugin);
    
    // Test scroll to first section
    const firstSection = document.querySelector('section[id]');
    if (firstSection) {
        console.log('Testing scroll to:', '#' + firstSection.id);
        smoothScrollTo('#' + firstSection.id);
    }
}

// Make debug function globally available
window.debugNavigation = debugNavigation;

console.log('Rapture Twelve JavaScript loaded successfully - All 1176+ lines preserved and navigation fixed!');