// Cookie Consent Modal Handling
// Show modal on first load if no choice is stored in localStorage
const modal = document.getElementById('cookie-modal');
const acceptAll = document.getElementById('accept-all');
const manageCookies = document.getElementById('manage-cookies');
const rejectAll = document.getElementById('reject-all');

if (!localStorage.getItem('cookieChoice')) {
    modal.style.display = 'flex'; // Display modal as flex for centering
}

// Event listeners for cookie buttons
acceptAll.addEventListener('click', () => {
    localStorage.setItem('cookieChoice', 'accept');
    modal.style.display = 'none';
});

manageCookies.addEventListener('click', () => {
    // Placeholder for manual cookie management (can be expanded later)
    alert('Manual cookie management not implemented yet.');
});

rejectAll.addEventListener('click', () => {
    localStorage.setItem('cookieChoice', 'reject');
    modal.style.display = 'none';
});

// Header Scroll Effect
// Make header solid when scrolling past 50px
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('solid');
    } else {
        header.classList.remove('solid');
    }
});

// Hero Slideshow
// Automatic slideshow with fade transitions
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;

function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    // Add active class to the current slide
    slides[index].classList.add('active');
    // Update indicators
    updateIndicators(index);
}

function updateIndicators(activeIndex) {
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextSlide() {
    // Cycle to the next slide
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Event listeners for indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Start slideshow, changing every 5 seconds
setInterval(nextSlide, 5000);

// Contact Form Handling
// Prevent default submit, log data, show success message
const form = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting
    const formData = new FormData(form);
    const data = Object.fromEntries(formData); // Convert to object
    console.log('Form Data:', data); // Log to console for now
    successMessage.style.display = 'block'; // Show success message
    form.reset(); // Reset form
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});