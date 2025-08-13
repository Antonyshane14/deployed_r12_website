// Moved inline scripts for security compliance
// This file contains all the inline JavaScript moved from index.html

// Google Analytics (moved from head)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QH57LZ6BM5');

// Iframe loading handler (moved from innovation section)
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.getElementById('demoFrame');
    const showcaseContainer = document.querySelector('.showcase-iframe');
    
    if (iframe && showcaseContainer) {
        iframe.addEventListener('load', function() {
            this.classList.add('loaded');
            showcaseContainer.classList.add('iframe-loaded');
        });
        
        // Fallback to remove loading spinner after 3 seconds
        setTimeout(() => {
            iframe.classList.add('loaded');
            showcaseContainer.classList.add('iframe-loaded');
        }, 3000);
    }
});

// Demo initialization script (moved from before closing body)
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemo);
    } else {
        initDemo();
    }
    
    function initDemo() {
        const innovationSection = document.getElementById('innovation');
        const demoFrame = document.getElementById('demoFrame');
        
        if (!innovationSection || !demoFrame) return;
        
        let demoStarted = false;
        let frameReady = false;
        
        // Simple iframe communication
        function sendToDemo(action) {
            try {
                // Try direct access first
                const doc = demoFrame.contentDocument || demoFrame.contentWindow.document;
                const startBtn = doc.getElementById('startBtn');
                const pauseBtn = doc.getElementById('pauseBtn');
                
                if (action === 'start' && startBtn) {
                    startBtn.click();
                    demoStarted = true;
                    return true;
                } else if (action === 'pause' && pauseBtn && pauseBtn.textContent.includes('Pause')) {
                    pauseBtn.click();
                    return true;
                } else if (action === 'resume' && pauseBtn && pauseBtn.textContent.includes('Resume')) {
                    pauseBtn.click();
                    return true;
                }
            } catch (e) {
                // Fallback to postMessage
                try {
                    demoFrame.contentWindow.postMessage({ action: action }, '*');
                    if (action === 'start') demoStarted = true;
                    return true;
                } catch (err) {
                    console.log('Demo control failed:', err);
                }
            }
            return false;
        }
        
        // Wait for iframe to load
        demoFrame.onload = () => {
            frameReady = true;
            // Check if section is already visible
            setTimeout(() => {
                const rect = innovationSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    sendToDemo('start');
                }
            }, 500);
        };
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!frameReady) return;
                
                if (entry.isIntersecting) {
                    // Section is visible
                    if (!demoStarted) {
                        sendToDemo('start');
                    } else {
                        sendToDemo('resume');
                    }
                } else {
                    // Section is not visible
                    sendToDemo('pause');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });
        
        observer.observe(innovationSection);
        
        // Handle tab visibility
        document.addEventListener('visibilitychange', () => {
            if (!frameReady) return;
            
            if (document.hidden) {
                sendToDemo('pause');
            } else {
                const rect = innovationSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!demoStarted) {
                        sendToDemo('start');
                    } else {
                        sendToDemo('resume');
                    }
                }
            }
        });
    }
})();

// Mobile auto-hover functionality
(function() {
    'use strict';
    
    // Only run on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function initAutoHover() {
        if (!isMobile()) return;
        
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        if (caseStudyCards.length === 0) return;
        
        console.log('Setting up auto-hover for', caseStudyCards.length, 'case study cards on mobile');
        
        let currentActiveCard = null;
        
        // Create intersection observer for one-at-a-time activation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // New card is visible - make it active and deactivate others
                    
                    // First, remove active state from previous card
                    if (currentActiveCard && currentActiveCard !== entry.target) {
                        currentActiveCard.classList.add('leaving');
                        setTimeout(() => {
                            currentActiveCard.classList.remove('in-view');
                            currentActiveCard.classList.remove('leaving');
                        }, 50); // Quick exit for previous card
                    }
                    
                    // Then activate the new card
                    entry.target.classList.remove('leaving');
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                        currentActiveCard = entry.target; // Set as current active
                        console.log('New card activated, previous deactivated');
                    }, 100);
                    
                } else {
                    // Card left view - only deactivate if it was the current active card
                    if (entry.target === currentActiveCard) {
                        entry.target.classList.add('leaving');
                        setTimeout(() => {
                            entry.target.classList.remove('in-view');
                            entry.target.classList.remove('leaving');
                            currentActiveCard = null; // Clear current active
                            console.log('Active card deactivated');
                        }, 50);
                    }
                }
            });
        }, {
            threshold: 0.7, // Trigger when 70% of card is visible (later trigger)
            rootMargin: '0px 0px -150px 0px' // Need to scroll more - trigger point much lower
        });
        
        // Start observing all case study cards
        caseStudyCards.forEach(card => {
            observer.observe(card);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (!isMobile()) {
                // Remove all in-view classes when switching to desktop
                caseStudyCards.forEach(card => {
                    card.classList.remove('in-view');
                });
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoHover);
    } else {
        initAutoHover();
    }
    
    // Re-initialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initAutoHover, 250);
    });
    
})();

// Leader card mobile glow effect
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth <= 768) {
        const cards = document.querySelectorAll(".leader-card");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("mobile-glow");
                } else {
                    entry.target.classList.remove("mobile-glow");
                }
            });
        }, { threshold: 0.3 }); // triggers when 30% visible

        cards.forEach(card => observer.observe(card));
    }
});
