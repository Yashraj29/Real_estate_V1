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
// Automatic slideshow with fade transitions and manual indicators
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

// Property Listings: Fetch from Google Sheets, Display, Pagination, Search
let allProperties = [];
let currentPage = 1;
const propertiesPerPage = 6;

async function fetchProperties() {
    // Replace with your Google Apps Script web app URL for fetching listings
    // Example: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=fetchListings
    // The script should return JSON array of properties with fields like: id, name, location, price, images (array), details, builder, area, parking, brochureUrl
    const url = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=fetchListings';
    try {
        const response = await fetch(url);
        const data = await response.json();
        allProperties = data; // Assume data is an array of property objects
        displayProperties();
    } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback: Use dummy data if fetch fails
        allProperties = [
    { id: 1, name: 'Modern Villa', location: 'Malibu, CA', price: '2,500,000', areaSize: '5000', metric: 'sq ft', images: ['https://via.placeholder.com/300'], details: 'Luxury villa with ocean views.', builder: 'ABC Builders', parking: 'Yes, 2 spots', brochureUrl: '#' },
    // Add more with areaSize and metric
        ];
        displayProperties();
    }
}

function displayProperties(properties = allProperties, page = 1) {
    const grid = document.getElementById('property-grid');
    grid.innerHTML = '';
    const start = (page - 1) * propertiesPerPage;
    const end = start + propertiesPerPage;
    const pageProperties = properties.slice(start, end);

    pageProperties.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <img src="${prop.images[0]}" alt="${prop.name}">
            <h3>${prop.name}</h3>
            <p>Location: ${prop.location}</p>
            <p>Price: $${prop.price}</p>
            <p>Area: ${prop.areaSize} ${prop.metric}</p>  <!-- Added area size -->
            <button class="btn-secondary view-details" data-id="${prop.id}">View Info</button>
        `;
        grid.appendChild(card);
    });

    updatePagination(properties.length, page);
}

function updatePagination(total, page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(total / propertiesPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle('active', i === page);
        btn.addEventListener('click', () => {
            currentPage = i;
            displayProperties(allProperties, currentPage);
        });
        pagination.appendChild(btn);
    }
}

// Search Functionality
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.toLowerCase();
    const message = document.getElementById('search-message');
    let filtered = allProperties.filter(p => p.name.toLowerCase().includes(query));
    if (filtered.length > 0) {
        // Show matching + similar in location
        const location = filtered[0].location;
        const similar = allProperties.filter(p => p.location === location && !filtered.includes(p));
        filtered = [...filtered, ...similar.slice(0, 5)]; // Up to 6 total
        message.style.display = 'none';
    } else {
        // Show message + similar properties
        filtered = allProperties.slice(0, 6);
        message.textContent = "Can't find the property you're looking for, but here are similar properties.";
        message.style.display = 'block';
    }
    displayProperties(filtered, 1); // Reset to page 1 for search results
});

// Property Details Modal
const propertyModal = document.getElementById('property-modal');
const closeModal = document.getElementById('close-modal');

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-details')) {
        const id = e.target.dataset.id;
        const prop = allProperties.find(p => p.id == id);
        if (prop) {
            document.getElementById('modal-title').textContent = prop.name;
            document.getElementById('modal-images').innerHTML = prop.images.map(img => `<img src="${img}" alt="${prop.name}">`).join('');
            document.getElementById('modal-details').textContent = `Details: ${prop.details}`;
            document.getElementById('modal-builder').textContent = `Builder: ${prop.builder}`;
            document.getElementById('modal-location').textContent = `Location: ${prop.location}`;
            document.getElementById('modal-area').textContent = `Area: ${prop.area}`;
            document.getElementById('modal-parking').textContent = `Parking: ${prop.parking}`;
            document.getElementById('modal-brochure').href = prop.brochureUrl;
            propertyModal.style.display = 'flex';
        }
    }
});

closeModal.addEventListener('click', () => {
    propertyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === propertyModal) {
        propertyModal.style.display = 'none';
    }
});

// Contact Form Handling: Submit to Google Sheets
const form = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Replace with your Google Apps Script web app URL for storing enquiries
    // Example: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=storeEnquiry
    const url = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=storeEnquiry';
    
    try {
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        successMessage.style.display = 'block';
        form.reset();
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    fetchProperties();
});