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
        
        // Update phone numbers based on language
        updatePhoneNumbers(lang);
        
        // Store preference
        localStorage.setItem('preferredLanguage', lang);
    }
    
    function updatePhoneNumbers(lang) {
        document.querySelectorAll('.phone-numbers[data-country]').forEach(el => el.style.display = 'none');
        // Hide all phone number containers
        const phoneContainers = document.querySelectorAll('.phone-numbers');
        phoneContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // When user manually switches language, hide all country-based containers
        const countryBasedContainers = document.querySelectorAll('.phone-numbers[data-country]');
        countryBasedContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Show only the appropriate language-based container
        const currentPhoneContainer = document.querySelector(`.phone-numbers[data-lang="${lang}"]`);
        if (currentPhoneContainer) {
            currentPhoneContainer.style.display = 'block';
        }
        
        // Update body class to match language
        document.body.className = document.body.className.replace(/lang-\w+/g, '');
        document.body.classList.add(`lang-${lang}`);
        
        // Mark that manual language switching is active to prevent country-based display
        window.manualLanguageSwitch = true;
    }
    
    // Special function for auto-language switching from country detection
    function switchLanguageForCountry(lang) {
        // Update active language button
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update localized text (without phone number handling)
        const elements = document.querySelectorAll('.localized-text');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.innerHTML = text;
            }
        });
        
        // Set body class for language
        document.body.className = document.body.className.replace(/lang-\w+/g, '');
        document.body.classList.add(`lang-${lang}`);
        
        // Update nav links
        updateNavLinks();
        
        // Store preference
        localStorage.setItem('preferredLanguage', lang);
    }
    
    // Country detection and phone number setup
    let countryDetected = false;
    
    async function detectCountryAndSetup() {
        try {
            // Create a timeout controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://ipinfo.io/json?token=9b7acc9879a7e5', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            const countryCode = data.country;
            
            console.log('Detected country:', countryCode);
            
            // Set body class and show appropriate phone numbers based on country
            setCountryBasedDisplay(countryCode);
            
        } catch (error) {
            console.log('Country detection failed, using other countries default:', error);
            // For API failures, use the default "other countries" behavior
            // This shows only Dutch number with English language
            setCountryBasedDisplay('default');
        }
    }
    
    function setCountryBasedDisplay(countryCode) {
        // Don't override if manual language switching is already active
        if (window.manualLanguageSwitch) {
            return;
        }
        
        // Hide all phone number containers first
        document.querySelectorAll('.phone-numbers[data-lang]').forEach(el => el.style.display = 'none');
        const allPhoneContainers = document.querySelectorAll('.phone-numbers');
        allPhoneContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // When auto-detection runs, hide all language-based containers
        const languageBasedContainers = document.querySelectorAll('.phone-numbers[data-lang]');
        languageBasedContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Set language and phone display based on country
        let language = 'en';
        let phoneSelector = '[data-country="other"]'; // default fallback
        
        switch (countryCode) {
            case 'US':
                language = 'en';
                phoneSelector = '[data-country="US"]';
                break;
            case 'GB':
                language = 'en';
                phoneSelector = '[data-country="GB"]';
                break;
            case 'NL':
                language = 'nl';
                phoneSelector = '[data-lang="nl"]';
                break;
            case 'ES':
                language = 'es';
                phoneSelector = '[data-lang="es"]';
                break;
            case 'fallback':
                // Only used for testing - shows all numbers
                language = 'en';
                phoneSelector = '[data-country="fallback"]';
                break;
            case 'default':
                // Used when API fails - shows only Dutch number
                language = 'en';
                phoneSelector = '[data-country="other"]';
                break;
            default:
                // All other countries including India - shows only Dutch number with English
                language = 'en';
                phoneSelector = '[data-country="other"]';
                break;
        }
        
        // Apply language switching for all countries
        switchLanguageForCountry(language);
        
        // Show the appropriate phone number container
        const phoneContainer = document.querySelector(`.phone-numbers${phoneSelector}`);
        if (phoneContainer) {
            phoneContainer.style.display = 'block';
        }
        
        console.log('Country:', countryCode, 'Language:', language, 'Phone selector:', phoneSelector);
        
        // Mark country detection as completed
        countryDetected = true;
    }
    
    // Initialize country detection
    detectCountryAndSetup();
    
    // Debug function to test country detection manually
    window.testCountryDetection = function(countryCode) {
        console.log('Testing country detection for:', countryCode);
        // Reset state
        window.manualLanguageSwitch = false;
        countryDetected = false;
        
        // Hide all phone containers
        const allPhoneContainers = document.querySelectorAll('.phone-numbers');
        allPhoneContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Test the country detection
        setCountryBasedDisplay(countryCode);
        
        // Check results
        const activePhoneContainer = document.querySelector('.phone-numbers[style*="block"]');
        const activeLangButton = document.querySelector('.lang-btn.active');
        const bodyClass = document.body.className;
        
        console.log('Results:');
        console.log('- Active phone container:', activePhoneContainer ? activePhoneContainer.getAttribute('data-country') || activePhoneContainer.getAttribute('data-lang') : 'None');
        console.log('- Active language button:', activeLangButton ? activeLangButton.getAttribute('data-lang') : 'None');
        console.log('- Body class:', bodyClass);
        console.log('- Country detected flag:', countryDetected);
        
        // Show phone numbers
        if (activePhoneContainer) {
            const phones = activePhoneContainer.querySelectorAll('a[href^="tel:"]');
            console.log('- Phone numbers:', Array.from(phones).map(p => p.href.replace('tel:', '')));
        }
        
        return {
            phoneContainer: activePhoneContainer,
            language: activeLangButton ? activeLangButton.getAttribute('data-lang') : null,
            bodyClass: bodyClass,
            countryDetected: countryDetected
        };
    };
    
    // Quick test for India
    window.testIndia = function() {
        console.log('=== TESTING INDIA ===');
        return testCountryDetection('IN');
    };
    
    // Comprehensive test for all country scenarios
    window.testAllCountries = function() {
        console.log('🌍 COMPREHENSIVE COUNTRY DETECTION TEST');
        console.log('=====================================');
        
        const testCases = [
            { country: 'US', expectedLang: 'en', expectedPhone: 'US', description: '🇺🇸 United States' },
            { country: 'GB', expectedLang: 'en', expectedPhone: 'GB', description: '🇬🇧 United Kingdom' },
            { country: 'NL', expectedLang: 'nl', expectedPhone: 'nl', description: '🇳🇱 Netherlands' },
            { country: 'ES', expectedLang: 'es', expectedPhone: 'es', description: '🇪🇸 Spain' },
            { country: 'IN', expectedLang: 'en', expectedPhone: 'other', description: '🇮🇳 India' },
            { country: 'DE', expectedLang: 'en', expectedPhone: 'other', description: '🇩🇪 Germany' },
            { country: 'FR', expectedLang: 'en', expectedPhone: 'other', description: '🇫🇷 France' },
            { country: 'default', expectedLang: 'en', expectedPhone: 'other', description: '⚠️ API Failure' },
            { country: 'fallback', expectedLang: 'en', expectedPhone: 'fallback', description: '🔧 Test Fallback' }
        ];
        
        let allPassed = true;
        
        testCases.forEach((test, index) => {
            console.log(`\n${index + 1}. Testing ${test.description}`);
            console.log(`   Country Code: ${test.country}`);
            
            const result = testCountryDetection(test.country);
            
            // Check language
            const langPassed = result.language === test.expectedLang;
            console.log(`   ✅ Language: ${result.language} ${langPassed ? '✅' : '❌ Expected: ' + test.expectedLang}`);
            
            // Check phone container
            const phoneContainer = result.phoneContainer;
            let phonePassed = false;
            let actualPhone = 'none';
            
            if (phoneContainer) {
                if (test.expectedPhone === 'fallback') {
                    phonePassed = phoneContainer.getAttribute('data-country') === 'fallback';
                    actualPhone = 'fallback (all numbers)';
                } else if (test.expectedPhone === 'other') {
                    phonePassed = phoneContainer.getAttribute('data-country') === 'other';
                    actualPhone = 'other (Dutch number)';
                } else if (['US', 'GB'].includes(test.expectedPhone)) {
                    phonePassed = phoneContainer.getAttribute('data-country') === test.expectedPhone;
                    actualPhone = `${test.expectedPhone} number`;
                } else if (['nl', 'es'].includes(test.expectedPhone)) {
                    phonePassed = phoneContainer.getAttribute('data-lang') === test.expectedPhone;
                    actualPhone = `${test.expectedPhone} number`;
                }
            }
            
            console.log(`   📞 Phone: ${actualPhone} ${phonePassed ? '✅' : '❌ Expected: ' + test.expectedPhone}`);
            
            if (!langPassed || !phonePassed) {
                allPassed = false;
            }
        });
        
        console.log('\n=====================================');
        console.log(`🎯 OVERALL RESULT: ${allPassed ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
        console.log('=====================================');
        
        return allPassed;
    };
    
    // Test actual live country detection
    window.testLiveDetection = async function() {
        console.log('🌐 TESTING LIVE COUNTRY DETECTION');
        console.log('==================================');
        
        // Reset everything
        window.manualLanguageSwitch = false;
        countryDetected = false;
        
        const allPhoneContainers = document.querySelectorAll('.phone-numbers');
        allPhoneContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        console.log('Running actual country detection...');
        
        try {
            await detectCountryAndSetup();
            
            // Give it a moment to complete
            setTimeout(() => {
                const activeContainer = document.querySelector('.phone-numbers[style*="block"]');
                const activeLang = document.querySelector('.lang-btn.active');
                
                console.log('\n🎯 LIVE DETECTION RESULTS:');
                console.log('- Language:', activeLang ? activeLang.getAttribute('data-lang') : 'None');
                console.log('- Body class:', document.body.className);
                
                if (activeContainer) {
                    const containerType = activeContainer.getAttribute('data-country') || activeContainer.getAttribute('data-lang');
                    const phones = activeContainer.querySelectorAll('a[href^="tel:"]');
                    console.log('- Phone container:', containerType);
                    console.log('- Phone numbers:', Array.from(phones).map(p => p.href.replace('tel:', '')));
                } else {
                    console.log('- Phone container: None visible ❌');
                }
                
                console.log('- Country detected flag:', countryDetected);
                console.log('==================================');
            }, 500);
            
        } catch (error) {
            console.error('Error during live detection:', error);
        }
    };
    
    // Debug function to show all phone containers and their status
    window.showPhoneContainersStatus = function() {
        const containers = document.querySelectorAll('.phone-numbers');
        console.log('Phone containers status:');
        containers.forEach((container, index) => {
            const country = container.getAttribute('data-country');
            const lang = container.getAttribute('data-lang');
            const display = window.getComputedStyle(container).display;
            const identifier = country || lang || 'unknown';
            console.log(`${index + 1}. [${identifier}] - Display: ${display}`);
        });
    };
    
    // Initialize language (only if country detection didn't set it)
    setTimeout(() => {
        if (!countryDetected) {
            const savedLang = localStorage.getItem('preferredLanguage') || 'en';
            switchLanguage(savedLang);
        }
    }, 100);
    
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
    
    // CTA button is now a direct link to Google Calendar - no JavaScript needed
    
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
        const stepWindows = document.querySelectorAll('[class*="step-"][class*="-window"]');
        
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
        
        // Add click event listeners to roadmap circles
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
        
        // Add click event listeners to step windows
        stepWindows.forEach((stepWindow, index) => {
            // Extract step number from class name (e.g., "step-1-window" -> 1)
            const stepNumber = parseInt(stepWindow.className.match(/step-(\d+)-window/)[1]);
            
            stepWindow.addEventListener('click', (e) => {
                // Prevent the click if it's on a video wrapper (to avoid conflicts with video modal)
                if (e.target.closest('.step-video-wrapper')) {
                    return;
                }
                scrollToStep(stepNumber);
            });
            
            // Add visual feedback on hover to indicate clickability - matching roadmap circle effect
            stepWindow.style.cursor = 'pointer';
            stepWindow.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            
            stepWindow.addEventListener('mouseenter', () => {
                stepWindow.style.boxShadow = '0 8px 25px rgba(254, 1, 88, 0.25), 0 0 0 8px rgba(254, 1, 88, 0.08)';
                stepWindow.style.transform = 'scale(1.05)';
            });
            
            stepWindow.addEventListener('mouseleave', () => {
                stepWindow.style.boxShadow = '';
                stepWindow.style.transform = '';
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