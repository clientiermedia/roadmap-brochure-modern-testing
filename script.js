document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    setLanguage('en');
    
    // Language switcher
    const langButtons = document.querySelectorAll('.lang-btn');
    const localizedTexts = document.querySelectorAll('.localized-text');
    
    // Cache DOM elements for better performance
    const elementsCache = new Map();
    
    function switchLanguage(lang) {
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update text content
        localizedTexts.forEach(element => {
            const text = element.dataset[lang];
            if (text) {
                element.innerHTML = text;
            }
        });
        
        // Store preference
        localStorage.setItem('preferredLanguage', lang);
    }
    
    // Initialize language
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
    
    // Add event listeners
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchLanguage(button.dataset.lang);
        });
    });
    
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    // Check on initial load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
    
    // Make video containers visible on load
    const videoContainers = document.querySelectorAll('.video-container');
    setTimeout(() => {
        videoContainers.forEach((container, index) => {
            setTimeout(() => {
                container.classList.add('visible');
            }, index * 100);
        });
    }, 300);
    
    // CTA button interaction
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Here you would typically trigger a modal or redirect to a booking page
            alert('Booking functionality would be implemented here!');
        });
    }
    
    // Update nav links based on language
    updateNavLinks();
    
    // Optimized scroll reveal with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once revealed for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.addEventListener('DOMContentLoaded', () => {
        revealElements.forEach(element => {
            observer.observe(element);
        });
    });
    
    // Throttled scroll handler for header effects
    let ticking = false;
    
    function updateHeader() {
        const header = document.querySelector('header');
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            header.style.background = 'rgba(26, 13, 74, 0.98)';
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(26, 13, 74, 0.95)';
            header.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // Optimized scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Preload critical resources
    function preloadResources() {
        // Preload fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    // Initialize optimizations
    document.addEventListener('DOMContentLoaded', () => {
        preloadResources();
        
        // Add loading class to body for initial animations
        document.body.classList.add('loaded');
    });
    
    // Optimize video loading
    document.addEventListener('DOMContentLoaded', () => {
        const videoIframes = document.querySelectorAll('.video-wrapper iframe');
        
        // Use Intersection Observer for lazy loading videos
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    // Add loading optimization
                    iframe.style.willChange = 'transform';
                    videoObserver.unobserve(iframe);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        videoIframes.forEach(iframe => {
            videoObserver.observe(iframe);
        });
    });
    
    // Roadmap navigation functionality
    function initRoadmapNavigation() {
        const roadmapCircles = document.querySelectorAll('.roadmap-bar li');
        const videoContainers = document.querySelectorAll('.video-container');
        
        function scrollToStep(stepNumber) {
            // Find the video container with the matching number indicator
            const targetContainer = document.querySelector(`.video-container .number-indicator:nth-child(1)`);
            const allContainers = document.querySelectorAll('.video-container');
            let matchingContainer = null;
            
            // Find the container with the matching step number
            allContainers.forEach(container => {
                const numberIndicator = container.querySelector('.number-indicator');
                if (numberIndicator && numberIndicator.textContent.trim() === stepNumber.toString()) {
                    matchingContainer = container;
                }
            });
            
            if (matchingContainer) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const windowHeight = window.innerHeight;
                
                // Get the absolute position of the container from the top of the document
                const containerRect = matchingContainer.getBoundingClientRect();
                const currentScrollY = window.scrollY;
                const containerAbsoluteTop = containerRect.top + currentScrollY;
                
                // Position the container in the center of the viewport
                const viewportOffset = windowHeight * 0.5; // 50% from top of viewport
                const targetPosition = containerAbsoluteTop - headerHeight - viewportOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add visual feedback with enhanced animations
                matchingContainer.style.transform = 'scale(1.02)';
                
                // Trigger hover effects
                matchingContainer.classList.add('force-hover');
                
                // Show progress indicator with animation
                const progressIndicator = matchingContainer.querySelector('.progress-indicator');
                if (progressIndicator) {
                    progressIndicator.style.opacity = '1';
                    progressIndicator.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                    progressIndicator.style.animation = 'progressPulse 2s ease-in-out infinite';
                }
                
                // Trigger iframe hover effect
                const iframe = matchingContainer.querySelector('iframe');
                if (iframe) {
                    iframe.style.transform = 'scale(1.02)';
                    iframe.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                }
                
                // Reset effects after animation
                setTimeout(() => {
                    matchingContainer.style.transform = '';
                    matchingContainer.classList.remove('force-hover');
                    
                    if (progressIndicator) {
                        progressIndicator.style.opacity = '';
                        progressIndicator.style.transform = '';
                        progressIndicator.style.animation = '';
                    }
                    
                    if (iframe) {
                        iframe.style.transform = '';
                        iframe.style.boxShadow = '';
                    }
                }, 3000); // Keep effects for 3 seconds
            }
        }
        
        // Add click event listeners
        roadmapCircles.forEach((circle, index) => {
            circle.addEventListener('click', () => {
                scrollToStep(index + 1);
            });
            
            // Add keyboard support
            circle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToStep(index + 1);
                }
            });
        });
    }
    
    // Initialize roadmap navigation
    initRoadmapNavigation();
    
    // Step 1 video modal functionality
    function initStep1VideoModal() {
        const step1VideoWrapper = document.querySelector('.step-1-window .step-video-wrapper');
        
        if (step1VideoWrapper) {
            step1VideoWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const iframe = step1VideoWrapper.querySelector('iframe');
                if (iframe) {
                    const videoSrc = iframe.src;
                    openVideoModal(videoSrc);
                }
            });
        }
    }

    // Video modal functions
    function openVideoModal(videoSrc) {
        let videoModal = document.getElementById('videoModal');
        
        // Create modal if it doesn't exist
        if (!videoModal) {
            videoModal = document.createElement('div');
            videoModal.id = 'videoModal';
            videoModal.className = 'video-modal';
            videoModal.innerHTML = `
                <div class="video-modal-content">
                    <button class="modal-close" onclick="closeVideoModal()">&times;</button>
                    <iframe id="modalVideo" src="" allowfullscreen allow="encrypted-media; fullscreen;"></iframe>
                </div>
            `;
            document.body.appendChild(videoModal);
        }
        
        const modalVideo = document.getElementById('modalVideo');
        if (modalVideo) {
            modalVideo.src = videoSrc;
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close video modal function (global)
    window.closeVideoModal = function() {
        const videoModal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        
        if (videoModal && modalVideo) {
            videoModal.classList.remove('active');
            modalVideo.src = '';
            document.body.style.overflow = '';
        }
    }

    // Initialize step 1 video modal
    initStep1VideoModal();
    
    // Close modal on backdrop click and escape key
    document.addEventListener('click', (e) => {
        const videoModal = document.getElementById('videoModal');
        if (videoModal && e.target === videoModal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
    
    // Wavy line animation on scroll
    function initWavyLineAnimation() {
        const roadmapBar = document.querySelector('.roadmap-bar');
        
        if (roadmapBar) {
            const lineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add class to trigger animation
                        entry.target.classList.add('animate-line');
                        // Stop observing once animated
                        lineObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -100px 0px'
            });
            
            lineObserver.observe(roadmapBar);
        }
    }
    
    // Initialize wavy line animation
    initWavyLineAnimation();
    
    // Performance monitoring (optional - can be removed in production)
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('script-start');
        
        window.addEventListener('load', () => {
            performance.mark('script-end');
            performance.measure('script-execution', 'script-start', 'script-end');
        });
    }
});

// Function to set language
function setLanguage(lang) {
    const elements = document.querySelectorAll('.localized-text');
    
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = text;
            } else {
                element.innerHTML = text;
            }
        }
    });
    
    // Update nav links with the new language
    updateNavLinks();
    
    // Store the language preference (optional)
    localStorage.setItem('preferredLanguage', lang);
    
    // Update html lang attribute
    document.documentElement.lang = lang;
}

// Function to update navigation links with the correct language
function updateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentLang = getCurrentLanguage();
    
    navLinks.forEach(link => {
        const text = link.getAttribute(`data-${currentLang}`);
        if (text) {
            link.textContent = text;
        }
    });
}

// Function to get the current language
function getCurrentLanguage() {
    const activeBtn = document.querySelector('.lang-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-lang') : 'en';
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for header
                behavior: 'smooth'
            });
        }
    });
}); 