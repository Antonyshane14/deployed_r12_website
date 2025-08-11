// Rapture Twelve - Complete Enhanced Navigation System
// Navigation works + Hero animations work

// Global state
let isInitialized = false;
let touchStartX = 0;
let touchStartY = 0;
let activeCard = null;

// Enhanced mobile detection with device capabilities
function isMobile() {
    const userAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const smallScreen = window.innerWidth <= 768;
    return userAgent || (touchCapable && smallScreen);
}

// Detect iOS for specific optimizations
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Haptic feedback for supported devices
function triggerHaptic(style = 'light') {
    if ('vibrate' in navigator) {
        switch(style) {
            case 'light': navigator.vibrate(10); break;
            case 'medium': navigator.vibrate(20); break;
            case 'heavy': navigator.vibrate(30); break;
            case 'success': navigator.vibrate([10, 50, 10]); break;
        }
    }
}

// Enhanced smooth scroll with momentum scrolling for iOS
function smoothScrollTo(targetId, callback) {
    // Remove the # if it exists
    const cleanId = targetId.replace('#', '');
    const target = document.getElementById(cleanId);
    
    if (!target) {
        console.warn('Target not found:', targetId);
        return;
    }
    
    // Calculate offset for fixed navbar
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;
    
    if (isMobile()) {
        // Use native smooth scrolling on mobile for better performance
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Callback after scroll completes (approximate)
        if (callback) {
            setTimeout(callback, 600);
        }
    } else {
        // Custom smooth scroll for desktop
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth deceleration
            const easeOut = progress * (2 - progress);
            window.scrollTo(0, startPosition + distance * easeOut);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(animation);
    }
}

// Initialize enhanced mobile navigation
function initializeNavigation() {
    console.log('Initializing enhanced navigation system...');
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Enhanced navbar scroll effect with iOS bounce handling
    let lastScrollY = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll for mobile
        if (isMobile() && Math.abs(scrollY - lastScrollY) > 5) {
            if (scrollY > lastScrollY && scrollY > 100) {
                navbar?.classList.add('navbar-hidden');
            } else {
                navbar?.classList.remove('navbar-hidden');
            }
            lastScrollY = scrollY;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
    
    // Enhanced mobile menu toggle with swipe gestures
    if (navToggle && navMenu) {
        // Click toggle
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Touch events for hamburger
        navToggle.addEventListener('touchstart', (e) => {
            e.target.classList.add('touching');
        }, { passive: true });
        
        navToggle.addEventListener('touchend', (e) => {
            setTimeout(() => {
                e.target.classList.remove('touching');
            }, 200);
        }, { passive: true });
        
        // Swipe to close menu
        if (isMobile()) {
            let menuTouchStartX = 0;
            
            navMenu.addEventListener('touchstart', (e) => {
                menuTouchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            navMenu.addEventListener('touchmove', (e) => {
                const touchX = e.touches[0].clientX;
                const diff = touchX - menuTouchStartX;
                
                // Swipe right to close
                if (diff > 100 && navMenu.classList.contains('active')) {
                    toggleMobileMenu(false);
                    triggerHaptic('light');
                }
            }, { passive: true });
        }
    }
    
    // Fix navigation links - properly handle both href="#section" and onclick="scrollToSection('section')"
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the target section from href or onclick
            let targetSection = link.getAttribute('href');
            
            // If href is just "#" or empty, try to extract from onclick
            if (!targetSection || targetSection === '#') {
                const onclickAttr = link.getAttribute('onclick');
                if (onclickAttr) {
                    // Extract section name from onclick="scrollToSection('section')"
                    const match = onclickAttr.match(/scrollToSection\(['"]([^'"]+)['"]\)/);
                    if (match && match[1]) {
                        targetSection = '#' + match[1];
                    }
                }
            }
            
            if (targetSection && targetSection !== '#') {
                handleNavClick(link, targetSection);
            }
        });
        
        // Touch feedback for mobile
        if (isMobile()) {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
                triggerHaptic('light');
            }, { passive: true });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('touch-active');
                }, 200);
            }, { passive: true });
        }
    });
    
    // Handle all other anchor links
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (href && href !== '#') {
                smoothScrollTo(href);
                triggerHaptic('light');
            }
        });
    });
    
    // Update active nav on scroll with debouncing
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    }, { passive: true });
    
    console.log('Navigation initialized successfully');
}

// Toggle mobile menu with animation
function toggleMobileMenu(state) {
    const navToggle = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    const shouldOpen = state !== undefined ? state : !navMenu.classList.contains('active');
    
    if (shouldOpen) {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        triggerHaptic('medium');
    } else {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        triggerHaptic('light');
    }
}

// Handle navigation click with smooth transitions
function handleNavClick(link, targetSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Close mobile menu
    toggleMobileMenu(false);
    
    // Update active state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Smooth scroll with callback
    smoothScrollTo(targetSection, () => {
        triggerHaptic('success');
    });
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
            // Check both href and onclick attributes
            const href = link.getAttribute('href');
            const onclickAttr = link.getAttribute('onclick');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else if (onclickAttr && onclickAttr.includes(`'${currentSection}'`)) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced video initialization for mobile
function initializeVideo() {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;
    
    // Configure video for optimal mobile performance
    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true; // Important for iOS
    heroVideo.autoplay = true;
    
    // Adjust video positioning
    heroVideo.style.objectFit = 'cover';
    heroVideo.style.objectPosition = 'center top';
    
    if (isMobile()) {
        // Reduce video quality on mobile for better performance
        heroVideo.style.transform = 'translateY(-15%)';
        
        // Pause video when not visible to save battery
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(() => {});
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.25 });
        
        observer.observe(heroVideo);
    } else {
        heroVideo.style.transform = 'translateY(-25%)';
    }
    
    // Try to play video
    heroVideo.play().catch(error => {
        console.log('Video autoplay failed:', error);
        // Add play button for mobile if autoplay fails
        if (isMobile()) {
            addVideoPlayButton(heroVideo);
        }
    });
}

// Add play button for video if autoplay fails
function addVideoPlayButton(video) {
    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.innerHTML = '▶';
    playBtn.setAttribute('aria-label', 'Play video');
    
    video.parentElement.appendChild(playBtn);
    
    playBtn.addEventListener('click', () => {
        video.play();
        playBtn.remove();
        triggerHaptic('medium');
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
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
            return true;
        }
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }
    return false;
}

// Enhanced contact form with mobile optimizations
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (!form) return;
    
    // Auto-resize textarea on mobile
    const textarea = form.querySelector('textarea');
    if (textarea && isMobile()) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }
    
    // Enhanced form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        if (submitButton.disabled) return;
        
        // Haptic feedback
        triggerHaptic('medium');
        
        // Check EmailJS
        if (!initializeEmailJS()) {
            showFormStatus('error', 'Email service unavailable. Please contact us directly.');
            return;
        }
        
        // Show loading with animation
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
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
                triggerHaptic('success');
                
                // Reset textarea height on mobile
                if (textarea && isMobile()) {
                    textarea.style.height = 'auto';
                }
            } else {
                throw new Error('Failed to send email');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            showFormStatus('error', 'Failed to send message. Please try again or contact us directly.');
            triggerHaptic('heavy');
        } finally {
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }, 1000);
        }
    });
    
    // Add input validation feedback on mobile
    if (isMobile()) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                    triggerHaptic('light');
                } else {
                    input.classList.remove('error');
                }
            });
        });
    }
}

// Show form status with animations
function showFormStatus(type, message) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;
    
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.classList.add('fade-in');
    
    if (type !== 'loading') {
        setTimeout(() => {
            formStatus.classList.add('fade-out');
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.classList.remove('fade-in', 'fade-out');
            }, 300);
        }, 5000);
    }
}

// Enhanced floating contact button for mobile
function initializeFloatingContact() {
    const floatingContact = document.getElementById('floating-contact');
    if (!floatingContact) return;
    
    let lastScrollY = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        const scrollY = window.pageYOffset;
        
        // Show button after scrolling down
        if (scrollY > 100) {
            floatingContact.classList.add('visible');
            
            // Hide temporarily while scrolling on mobile
            if (isMobile() && Math.abs(scrollY - lastScrollY) > 50) {
                floatingContact.classList.add('scrolling');
                
                scrollTimeout = setTimeout(() => {
                    floatingContact.classList.remove('scrolling');
                }, 1000);
            }
        } else {
            floatingContact.classList.remove('visible');
        }
        
        lastScrollY = scrollY;
    }, { passive: true });
    
    // Add touch feedback
    if (isMobile()) {
        const floatingBtn = floatingContact.querySelector('.floating-btn');
        if (floatingBtn) {
            floatingBtn.addEventListener('touchstart', () => {
                floatingBtn.classList.add('touch-active');
                triggerHaptic('medium');
            }, { passive: true });
            
            floatingBtn.addEventListener('touchend', () => {
                setTimeout(() => {
                    floatingBtn.classList.remove('touch-active');
                }, 200);
            }, { passive: true });
        }
    }
}

// Enhanced hero animations with mobile optimizations
function initializeHeroAnimations() {
    console.log('Initializing hero animations...');
    
    const heroElements = ['#hero-company-name', '#hero-tagline', '#hero-subtitle', '#hero-cta'];
    
    // Use GSAP if available, with mobile optimizations
    if (typeof gsap !== 'undefined') {
        try {
            console.log('GSAP detected, initializing premium animations...');
            
            // Register plugins
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
            if (typeof TextPlugin !== 'undefined') {
                gsap.registerPlugin(TextPlugin);
            }
            
            // Mobile-optimized timings
            const isMobileDevice = isMobile();
            const duration = isMobileDevice ? 0.4 : 0.6;
            const delay = isMobileDevice ? 0.2 : 0.3;
            
            // Set initial states
            gsap.set("#hero-company-name", { 
                opacity: 0, 
                scale: isMobileDevice ? 0.95 : 0.9, 
                y: isMobileDevice ? 30 : 50 
            });
            gsap.set("#hero-tagline", { opacity: 0, y: 20 });
            gsap.set("#hero-subtitle", { opacity: 0, y: 20 });
            gsap.set("#hero-cta", { opacity: 0, y: 20 });
            
            // Create timeline
            const heroTimeline = gsap.timeline({ delay: delay });
            
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
            
            // Typewriter effect - optimized for mobile
            if (typeof TextPlugin !== 'undefined') {
                setTimeout(() => {
                    const taglineElement = document.querySelector("#hero-tagline");
                    if (taglineElement) {
                        // Skip typewriter on very small screens to avoid layout issues
                        if (window.innerWidth > 360) {
                            gsap.to("#hero-tagline", {
                                duration: isMobileDevice ? 1.2 : 1.8,
                                text: "INFILTRATE • EXPLOIT • SECURE",
                                ease: "none",
                                delay: 0.2
                            });
                        }
                    }
                }, isMobileDevice ? 600 : 800);
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

// Fallback hero animation optimized for mobile
function fallbackHeroAnimation() {
    console.log('Using fallback hero animations...');
    
    const isMobileDevice = isMobile();
    const baseDelay = isMobileDevice ? 200 : 300;
    
    const heroElements = [
        { selector: '#hero-company-name', delay: baseDelay },
        { selector: '#hero-tagline', delay: baseDelay + 300 },
        { selector: '#hero-subtitle', delay: baseDelay + 500 },
        { selector: '#hero-cta', delay: baseDelay + 700 }
    ];
    
    heroElements.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector);
        if (element) {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = `translateY(${isMobileDevice ? '20px' : '30px'})`;
            element.style.transition = `opacity ${isMobileDevice ? '0.5s' : '0.6s'} ease, transform ${isMobileDevice ? '0.5s' : '0.6s'} ease`;
            
            // Animate in
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    });
    
    // Simple typewriter effect
    setTimeout(() => {
        const tagline = document.querySelector('#hero-tagline');
        if (tagline && window.innerWidth > 360) {
            const text = "INFILTRATE • EXPLOIT • SECURE";
            tagline.textContent = "";
            let i = 0;
            const speed = isMobileDevice ? 80 : 100;
            const typeInterval = setInterval(() => {
                tagline.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, speed);
        }
    }, isMobileDevice ? 1000 : 1200);
}

// Initialize case study cards with mobile interactions
function initializeCaseStudyCards() {
    const cards = document.querySelectorAll(".case-study-card");
    
    if (!cards.length) return;
    
    cards.forEach(card => {
        // Desktop click handler
        card.addEventListener("click", (e) => {
            if (!isMobile()) {
                handleCardActivation(card, cards);
            }
        });
        
        // Mobile touch handlers with better UX
        if (isMobile()) {
            let touchStartTime;
            let touchMoved = false;
            
            card.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchMoved = false;
                
                // Add touch feedback
                card.classList.add('touch-press');
                triggerHaptic('light');
                
                // Store touch position
                if (e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });
            
            card.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1) {
                    const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
                    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                    
                    // Detect if user is scrolling instead of tapping
                    if (deltaX > 10 || deltaY > 10) {
                        touchMoved = true;
                        card.classList.remove('touch-press');
                    }
                }
            }, { passive: true });
            
            card.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                card.classList.remove('touch-press');
                
                // Only activate if it was a tap (not scroll)
                if (!touchMoved && touchDuration < 500) {
                    e.preventDefault();
                    handleCardActivation(card, cards);
                    triggerHaptic('medium');
                }
            });
        }
    });
    
    // Close card when clicking outside on mobile
    if (isMobile()) {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.case-study-card') && activeCard) {
                cards.forEach(c => c.classList.remove('active'));
                activeCard = null;
            }
        });
    }
}

// Handle card activation with smooth animations
function handleCardActivation(card, allCards) {
    const wasActive = card.classList.contains('active');
    
    // Remove active class from all cards
    allCards.forEach(c => c.classList.remove('active'));
    
    if (!wasActive) {
        // Add active class to clicked card
        card.classList.add('active');
        activeCard = card;
        
        // Scroll card into view on mobile
        if (isMobile()) {
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 100);
        }
    } else {
        activeCard = null;
    }
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

// Enhanced mobile animations with better performance
function initializeMobileAnimations() {
    if (!isMobile()) return;
    
    console.log('Initializing enhanced mobile animations...');
    
    // Inject mobile-specific styles
    const style = document.createElement('style');
    style.textContent = `
        /* Video play button for mobile */
        .video-play-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: rgba(0, 255, 136, 0.9);
            border: none;
            border-radius: 50%;
            color: #000;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7); }
            70% { box-shadow: 0 0 0 20px rgba(0, 255, 136, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
        }
        
        /* Enhanced mobile animations */
        @media (max-width: 768px) {
            /* Fix leaders grid for mobile */
            .leaders-grid {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 1.5rem !important;
                padding: 0 1rem !important;
                width: 100% !important;
                flex-wrap: nowrap !important;
            }
            
            .leader-card {
                width: 100% !important;
                max-width: 400px !important;
                margin: 0 auto !important;
                padding: 1.5rem !important;
            }
            
            .leader-bio {
                text-align: left !important;
                font-size: 0.9rem !important;
            }
            
            /* Smooth fade-in animations */
            .mobile-fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .mobile-fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Touch feedback states */
            .touch-active {
                transform: scale(0.98) !important;
                opacity: 0.9 !important;
            }
            
            .touch-press {
                transform: scale(0.96) !important;
                box-shadow: 0 2px 10px rgba(0, 255, 136, 0.3) !important;
            }
            
            .touching {
                transform: scale(0.9) !important;
            }
            
            /* Card interactions */
            .service-card, .case-study-card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                -webkit-tap-highlight-color: transparent;
            }
            
            .case-study-card.active {
                transform: scale(1.02);
                box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
                z-index: 10;
            }
            
            /* Button interactions */
            .btn {
                transition: all 0.2s ease;
                -webkit-tap-highlight-color: transparent;
            }
            
            .btn:active {
                transform: scale(0.95);
            }
            
            .btn.loading {
                position: relative;
                color: transparent;
            }
            
            .btn.loading::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                margin: auto;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 2px solid transparent;
                border-top-color: #00ff88;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Floating button animations */
            .floating-contact.scrolling {
                transform: translateY(100px);
                opacity: 0.3;
            }
            
            .floating-contact.visible {
                animation: mobilePulse 3s infinite;
            }
            
            @keyframes mobilePulse {
                0%, 100% { 
                    transform: scale(1); 
                    box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
                }
                50% { 
                    transform: scale(1.05); 
                    box-shadow: 0 6px 25px rgba(0, 255, 136, 0.5);
                }
            }
            
            /* Navigation improvements */
            .navbar-hidden {
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            
            .nav-link.touch-active {
                background: rgba(0, 255, 136, 0.1);
                border-radius: 8px;
            }
            
            /* Form enhancements */
            input.error, textarea.error {
                border-color: #ff4444 !important;
                animation: shake 0.3s ease;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            /* Smooth transitions */
            .fade-in {
                animation: fadeIn 0.3s ease;
            }
            
            .fade-out {
                animation: fadeOut 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(10px); }
            }
            
            /* iOS-specific fixes */
            .ios-device {
                -webkit-overflow-scrolling: touch;
            }
            
            .ios-device input,
            .ios-device textarea,
            .ios-device select {
                font-size: 16px; /* Prevents zoom on focus */
            }
            
            /* Prevent overscroll bounce on iOS */
            .menu-open {
                position: fixed;
                width: 100%;
                overflow: hidden;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Add iOS class if needed
    if (isIOS()) {
        document.body.classList.add('ios-device');
    }
    
    // Add mobile animation classes to elements
    const animatedElements = document.querySelectorAll('[data-reveal], .service-card, .case-study-card, .leader-card');
    
    animatedElements.forEach(element => {
        element.classList.add('mobile-fade-in');
    });
    
    // Use Intersection Observer for performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add slight delay for staggered effect
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Haptic feedback for important reveals
                    if (entry.target.classList.contains('service-card') || 
                        entry.target.classList.contains('case-study-card')) {
                        triggerHaptic('light');
                    }
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((element, index) => {
        // Add stagger delay
        if (element.classList.contains('service-card') || 
            element.classList.contains('case-study-card') || 
            element.classList.contains('leader-card')) {
            element.dataset.delay = index % 3;
        }
        observer.observe(element);
    });
    
    // Touch event optimizations
    setupTouchOptimizations();
}

// Setup touch optimizations
function setupTouchOptimizations() {
    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, .btn, .nav-link');
    buttons.forEach(button => {
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });
    });
    
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.service-card, .case-study-card, .btn, .contact-method');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.classList.add('touch-feedback');
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.classList.remove('touch-feedback');
            }, 150);
        }, { passive: true });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('touch-feedback');
        }, { passive: true });
    });
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

// Modal functions
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        triggerHaptic('medium');
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        triggerHaptic('light');
    }
}

// Scroll to contact
function scrollToContact() {
    smoothScrollTo('#contact');
}

// Add CSS for form status and other elements
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
        
        /* Touch feedback */
        .touch-feedback {
            opacity: 0.8;
            transform: scale(0.98);
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
        initializeCaseStudyCards();
        
        // Initialize hero animations immediately
        setTimeout(() => {
            initializeHeroAnimations();
        }, 100);
        
        // Initialize mobile animations
        if (isMobile()) {
            setTimeout(() => {
                initializeMobileAnimations();
            }, 150);
        }
        
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