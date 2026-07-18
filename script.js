// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    /* ===== Loading Screen ===== */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    });

    /* ===== Theme Toggle (Dark/Light) ===== */
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn.querySelector('i');

    // Check Local Storage for Theme
    if(localStorage.getItem('theme') === 'light'){
        body.classList.replace('dark-mode', 'light-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
    }

    themeBtn.addEventListener('click', () => {
        if(body.classList.contains('dark-mode')){
            body.classList.replace('dark-mode', 'light-mode');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ===== Mobile Menu & Sticky Navbar ===== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');
    const header = document.getElementById('header');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('nav-active')){
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            }
        });
    });

    /* ===== Scroll Events: Progress, Sticky Nav, BackToTop, Active Link ===== */
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';

        // Sticky Nav
        header.classList.toggle('sticky', window.scrollY > 50);

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Active Navigation Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(scrollY >= (sectionTop - sectionHeight / 3)){
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href').includes(current)){
                link.classList.add('active');
            }
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===== Typing Animation ===== */
    const typedTextSpan = document.getElementById("typing-text");
    const textArray = ["B.Tech AI Student", "Web Developer", "Machine Learning Enthusiast", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }
    
    if(textArray.length) setTimeout(type, newTextDelay + 250);

    /* ===== Intersection Observers (Fade-in & Counters & Progress Bars) ===== */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('appear');
                
                // Animate Progress Bars
                if(entry.target.classList.contains('skill-card')){
                    const progress = entry.target.querySelector('.progress');
                    progress.style.width = progress.getAttribute('data-width');
                }

                // Animate Counters
                if(entry.target.classList.contains('about-content')){
                    const counters = document.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        counter.innerText = '0';
                        const updateCounter = () => {
                            const target = +counter.getAttribute('data-target');
                            const c = +counter.innerText;
                            const increment = target / 200; // Speed adjustment
                            
                            if(c < target) {
                                counter.innerText = `${Math.ceil(c + increment)}`;
                                setTimeout(updateCounter, 10);
                            } else {
                                counter.innerText = target + '+';
                            }
                        };
                        updateCounter();
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));


    /* ===== Form Validation ===== */
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Basic Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!name || !email || !subject || !message) {
            showFormMsg('Please fill in all fields.', '#ff4757');
            return;
        }

        if(!emailRegex.test(email)){
            showFormMsg('Please enter a valid email address.', '#ff4757');
            return;
        }

        // Simulate sending
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
            showFormMsg('Message sent successfully! I will get back to you soon.', '#2ed573');
            contactForm.reset();
            btn.innerHTML = originalText;
        }, 1500);
    });

    function showFormMsg(msg, color) {
        formMsg.textContent = msg;
        formMsg.style.color = color;
        setTimeout(() => { formMsg.textContent = ''; }, 4000);
    }

    /* ===== Button Ripple Effect ===== */
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            const ripples = document.createElement('span');
            
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-element');
            this.appendChild(ripples);
            
            setTimeout(() => { ripples.remove() }, 600);
        });
    });

});