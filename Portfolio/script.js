// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillCategories = document.querySelectorAll('.skill-category');
const skillsGroups = document.querySelectorAll('.skills-group');
const contactForm = document.getElementById('contactForm');

// Loading Screen
// Professional loading states
const loadingStates = [
    'Initializing...',
    'Loading assets...',
    'Preparing interface...',
    'Optimizing experience...',
    'Almost ready...',
    'Welcome'
];

// Premium progress animation — eased ring fill + slide-up reveal
function animateProgress() {
    const badge = document.getElementById('loaderBadge');
    const percentageText = document.getElementById('percentage');
    const stateText = document.getElementById('loadingState');
    const loader = document.getElementById('loader');

    const states = [
        { at: 0, label: 'Initializing' },
        { at: 24, label: 'Loading assets' },
        { at: 52, label: 'Preparing interface' },
        { at: 80, label: 'Optimizing experience' },
        { at: 100, label: 'Welcome' }
    ];

    const duration = 2200;
    const start = performance.now();
    let lastLabel = '';

    function setState(label) {
        if (!stateText || label === lastLabel) return;
        lastLabel = label;
        stateText.textContent = label;
        stateText.style.animation = 'none';
        void stateText.offsetWidth; // reflow to restart animation
        stateText.style.animation = 'statusFade 0.5s ease';
    }

    function frame(now) {
        const t = Math.min((now - start) / duration, 1);
        // easeInOutCubic for a deliberate, premium feel
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const value = eased * 100;

        if (badge) badge.style.setProperty('--progress', value.toFixed(1));
        if (percentageText) percentageText.textContent = Math.round(value);

        const current = states.filter(s => value >= s.at).pop();
        if (current) setState(current.label);

        if (t < 1) {
            requestAnimationFrame(frame);
        } else {
            if (badge) badge.style.setProperty('--progress', '100');
            if (percentageText) percentageText.textContent = '100';
            setState('Welcome');
            setTimeout(() => loader && loader.classList.add('hidden'), 520);
        }
    }
    requestAnimationFrame(frame);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateProgress, 350);
});

// Subtle mouse interaction
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    // Very subtle parallax on geometric elements
    const accents = document.querySelectorAll('.geometric-accent');
    accents.forEach((accent, index) => {
        const speed = (index + 1) * 0.3;
        accent.style.transform += ` translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active Navigation Link
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skills Category Switching
skillCategories.forEach(category => {
    category.addEventListener('click', () => {
        const targetGroup = category.getAttribute('data-category');
        
        // Remove active class from all categories and groups
        skillCategories.forEach(cat => cat.classList.remove('active'));
        skillsGroups.forEach(group => group.classList.remove('active'));
        
        // Add active class to clicked category and corresponding group
        category.classList.add('active');
        document.querySelector(`[data-group="${targetGroup}"]`).classList.add('active');
        
        // Animate skill bars
        animateSkillBars();
    });
});

// Animate Skill Bars
function animateSkillBars() {
    const activeGroup = document.querySelector('.skills-group.active');
    const skillBars = activeGroup.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 100);
    });
}

// Initialize skill bars animation on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        animateSkillBars();
    }, 2500);
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
});

// ---- Minimal, self-cleaning scroll reveals for content sections ----
document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const srObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('sr-in');
            srObserver.unobserve(el);
            // remove reveal classes once the transition is done so they
            // never override hover transforms / leave stale styles
            const cleanup = () => {
                el.classList.remove('sr', 'sr-in');
                el.style.transitionDelay = '';
                el.style.willChange = '';
                el.removeEventListener('transitionend', cleanup);
            };
            el.addEventListener('transitionend', cleanup);
            setTimeout(cleanup, 1300);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    const singles = [
        '.section-header',
        '.about-intro',
        '.contact .contact-info > .contact-text',
        '.contact-form'
    ];
    const groups = [
        '.about-details .detail-item',
        '.stats-grid .stat-card',
        '.timeline .timeline-item',
        '.projects-grid .project-card',
        '.skills-categories .skill-category',
        '.skills-group .skill-item',
        '.contact-details .contact-item'
    ];

    const tag = (el) => { el.classList.add('sr'); srObserver.observe(el); };

    singles.forEach(sel => document.querySelectorAll(sel).forEach(tag));
    groups.forEach(sel => {
        let prevParent = null, i = 0;
        document.querySelectorAll(sel).forEach(el => {
            if (el.parentElement !== prevParent) { prevParent = el.parentElement; i = 0; }
            el.style.transitionDelay = Math.min(i, 6) * 0.06 + 's';
            i++;
            tag(el);
        });
    });

    document.body.classList.add('sr-on');
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully!', 'success');
    contactForm.reset();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced Tech Icons Animation
function animateTechIcons() {
    const techIcons = document.querySelectorAll('.tech-icon');
    
    techIcons.forEach((icon, index) => {
        // Add hover tooltip
        icon.addEventListener('mouseenter', () => {
            const tech = icon.getAttribute('data-tech');
            showTooltip(icon, tech);
        });
        
        icon.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        // Add floating animation with different speeds
        const speed = 0.5 + (index * 0.1);
        const amplitude = 15 + (index * 5);
        
        setInterval(() => {
            const time = Date.now() * 0.001;
            const y = Math.sin(time * speed) * amplitude;
            const x = Math.cos(time * speed * 0.5) * (amplitude * 0.5);
            icon.style.transform = `translate(${x}px, ${y}px)`;
        }, 16);
    });
}

// Tooltip functions
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 1.2rem;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        border: 1px solid var(--border-color);
        transform: translateX(-50%);
        white-space: nowrap;
    `;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 40 + 'px';
    
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tech-tooltip');
    if (tooltip) {
        document.body.removeChild(tooltip);
    }
}

// Initialize enhanced animations
window.addEventListener('load', () => {
    setTimeout(() => {
        animateTechIcons();
    }, 2500);
});

// Typing Effect for Hero Title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
window.addEventListener('load', () => {
    setTimeout(() => {
        const titleElement = document.querySelector('.title-text');
        if (titleElement) {
            typeWriter(titleElement, 'Full Stack Developer', 150);
        }
    }, 3000);
});

// Project Card Hover Effects
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth reveal animations for timeline items
function revealTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
}

// Initialize timeline animation when section is visible
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            revealTimelineItems();
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const timelineSection = document.querySelector('.experience');
    if (timelineSection) {
        timelineObserver.observe(timelineSection);
    }
});

// Add dynamic background particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-1000px) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize particles
window.addEventListener('load', () => {
    setTimeout(() => {
        createParticles();
    }, 3000);
});

// Performance optimization: Throttle scroll events
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Existing scroll handlers here
}, 16));