document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    const currentSlideSpan = document.getElementById('currentSlide');
    const progressBar = document.getElementById('progressBar');
    let currentSideIndex = 0;
    let isTransitioning = false;

    // Initialize
    totalSlidesSpan.textContent = slides.length;
    updateProgress();

    // Scroll / Wheel Event
    window.addEventListener('wheel', (e) => {
        if (isTransitioning) return;
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    });

    // Arrow Keys
    window.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Touch Support (simple swipe)
    let touchStartY = 0;
    window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY);
    window.addEventListener('touchend', e => {
        if (isTransitioning) return;
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) nextSlide();
        if (touchEndY - touchStartY > 50) prevSlide();
    });

    function nextSlide() {
        if (currentSideIndex < slides.length - 1) {
            changeSlide(currentSideIndex + 1);
        }
    }

    function prevSlide() {
        if (currentSideIndex > 0) {
            changeSlide(currentSideIndex - 1);
        }
    }

    function changeSlide(newIndex) {
        if (newIndex === currentSideIndex) return;
        
        isTransitioning = true;
        
        // Handle "active" and "previous" classes for direction
        const currentSlide = slides[currentSideIndex];
        const nextSlide = slides[newIndex];

        // Determine direction for animation logic if needed, 
        // but our CSS handles translateY based on active class presence.
        // We need to manage the stack order.
        
        if (newIndex > currentSideIndex) {
            // Going down
            currentSlide.classList.add('previous');
            currentSlide.classList.remove('active');
        } else {
            // Going up
            nextSlide.classList.remove('previous'); // Ensure it's not marked as previous so it comes from top/center
        }

        // Clean up classes for all slides to ensure state is correct
        slides.forEach((slide, index) => {
            if (index < newIndex) {
                slide.classList.add('previous');
                slide.classList.remove('active');
            } else if (index === newIndex) {
                slide.classList.add('active');
                slide.classList.remove('previous');
            } else {
                slide.classList.remove('active');
                slide.classList.remove('previous');
            }
        });

        currentSideIndex = newIndex;
        updateProgress();

        setTimeout(() => {
            isTransitioning = false;
        }, 800); // Match CSS transition time
    }

    function updateProgress() {
        currentSlideSpan.textContent = currentSideIndex + 1;
        const progress = ((currentSideIndex + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay/easing to outline for smooth feel
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects on interactables
    const interactables = document.querySelectorAll('a, button, .glass-card, .skill-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(0, 242, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
});
