// Updated animation for hero elements with new structure
document.addEventListener('DOMContentLoaded', function() {
    // Set initial states for animation
    const heroElements = document.querySelectorAll('.hero-content-block h1, .hero-content-block p, .hero-content-block .button-group');
    
    heroElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger animations with delay
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 * index);
    });
});

// Further improved accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // First close any other open accordion
            const currentlyActive = document.querySelector('.accordion-item.active');
            if(currentlyActive && currentlyActive !== item) {
                // Add a class for special handling of closing animation
                currentlyActive.classList.add('closing');
                
                // Remove active after a short delay
                setTimeout(() => {
                    currentlyActive.classList.remove('active');
                    currentlyActive.classList.remove('closing');
                }, 50);
            }
            
            // Toggle this accordion with appropriate timing
            if (isActive) {
                item.classList.add('closing');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        item.classList.remove('active');
                        // Remove the closing class after animation completes
                        setTimeout(() => {
                            item.classList.remove('closing');
                        }, 200);
                    });
                });
            } else {
                item.classList.add('active');
            }
        });
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip for the home link
            if(this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if(targetSection) {
                // Add offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Update active class without changing header background
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header
    
    // Add scrolled class to header for possible styling
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector('.nav-link.active')?.classList.remove('active');
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        }
    });
});

// JavaScript-controlled grid animation
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    const grid = document.querySelector('.interactive-grid');
    
    if (heroSection && grid) {
        const cellSize = 40;
        const heroWidth = heroSection.offsetWidth;
        const heroHeight = heroSection.offsetHeight;
        const columns = Math.ceil(heroWidth / cellSize);
        const rows = Math.ceil(heroHeight / cellSize);
        
        // Calculate center point of the grid
        const centerX = Math.floor(columns / 2) * cellSize;
        const centerY = Math.floor(rows / 2) * cellSize;
        
        const cells = [];
        
        // Create grid cells
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                // Position the cell
                const left = col * cellSize;
                const top = row * cellSize;
                cell.style.left = `${left}px`;
                cell.style.top = `${top}px`;
                
                // Calculate distance from center for animation
                const distanceFromCenter = Math.sqrt(
                    Math.pow(left - centerX, 2) + 
                    Math.pow(top - centerY, 2)
                );
                
                // Store cell data for animation
                cells.push({
                    element: cell,
                    left,
                    top,
                    distance: distanceFromCenter,
                    animationOffset: distanceFromCenter * 0.003,
                    intensity: 0
                });
                
                grid.appendChild(cell);
            }
        }
        
        // Animation variables
        let animationFrame;
        const animationDuration = 4000; // 4 seconds
        const startTime = performance.now();
        
        // JavaScript animation function
        function animateGrid(timestamp) {
            const elapsed = (timestamp - startTime) % animationDuration;
            const progress = elapsed / animationDuration;
            
            // Maximum distance for normalization
            const maxDistance = Math.sqrt(Math.pow(heroWidth/2, 2) + Math.pow(heroHeight/2, 2));
            
            // Update each cell based on its distance from center
            cells.forEach(cell => {
                // Create a subtle wave effect
                const normalizedDistance = cell.distance / maxDistance;
                const wavePosition = progress - normalizedDistance * 0.6;
                const adjustedPosition = wavePosition % 1;
                
                // Use a gentle wave function for subtle ripples
                let intensity = 0;
                if (adjustedPosition > 0 && adjustedPosition < 0.4) {
                    // Create a smooth curve for the color transition
                    intensity = Math.sin((adjustedPosition / 0.4) * Math.PI) * 0.5;
                }
                
                // Only apply background color changes, keep border constant
                const opacity = Math.max(0.01, intensity * 0.1);
                cell.element.style.backgroundColor = `rgba(149, 165, 239, ${opacity * 0.8})`;
                
                // Keep border constant for all cells
                cell.element.style.borderColor = 'rgba(149, 165, 239, 0.03)';
                
                // Remove all box-shadow effects
                cell.element.style.boxShadow = 'none';
                
                cell.intensity = intensity;
            });
            
            animationFrame = requestAnimationFrame(animateGrid);
        }
        
        // Start animation
        animationFrame = requestAnimationFrame(animateGrid);
        
        // Optimization for scroll events
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const viewportHeight = window.innerHeight;
            
            cells.forEach(cell => {
                if (cell.top >= scrollTop - cellSize && cell.top <= scrollTop + viewportHeight) {
                    cell.element.style.display = 'block';
                } else {
                    cell.element.style.display = 'none';
                }
            });
        });
        
        // Clean up animation when leaving the page
        window.addEventListener('beforeunload', function() {
            cancelAnimationFrame(animationFrame);
        });
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create menu overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}); 