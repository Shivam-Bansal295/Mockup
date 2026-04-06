document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // 2. Sticky Navbar & Dark Mode transition on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initial check for scroll position
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // 3. Fade-Up Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // Hero Text delayed fade-in (simulate load delay requested)
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if(heroContent) {
           heroContent.classList.add('visible');
        }
    }, 600);

    // 4. Stats Counter Animation
    const statsSection = document.getElementById('stats');
    const statNums = document.querySelectorAll('.stat-num');
    let hasCounted = false;

    const countUp = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const isDecimal = element.getAttribute('data-decimal') === 'true';
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));
        const increment = target / steps;
        
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.innerText = isDecimal ? target.toFixed(1) : Math.floor(target);
                clearInterval(timer);
            } else {
                element.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
            }
        }, stepTime);
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                statNums.forEach(num => countUp(num));
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // 5. Reviews Carousel
    const track = document.getElementById('review-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = Array.from(track.children);
        
        // Calculate items per view based on window width
        const getItemsPerView = () => window.innerWidth > 768 ? 3 : 1;
        
        const updateCarousel = () => {
            const itemsPerView = getItemsPerView();
            const cardWidth = 100 / itemsPerView;
            // The transform percentage is offset by the current index multiplied by card width
            track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
        };
        
        nextBtn.addEventListener('click', () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = cards.length - itemsPerView;
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, cards.length - itemsPerView);
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            updateCarousel();
        });
    }

    // 6. Appointment Form Validation & Field Shake
    const form = document.getElementById('booking-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let hasError = false;
            const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    hasError = true;
                    field.classList.remove('shake');
                    // Use void/offset trick to reset animation
                    void field.offsetWidth;
                    field.classList.add('shake');
                } else {
                    field.classList.remove('shake');
                }
            });
            
            if (!hasError) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Appointment Confirmed ✓';
                submitBtn.style.backgroundColor = '#25D366';
                submitBtn.style.color = '#fff';
                
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                }, 3000);
            }
        });
        
        // Remove shake class on focus
        form.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('shake')) {
                e.target.classList.remove('shake');
            }
        });
    }
});
