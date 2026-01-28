// Handle dynamic form fields based on property type
const propertyType = document.getElementById('property-type');
const carpetGroup = document.getElementById('carpet-group');
const balconyGroup = document.getElementById('balcony-group');
const parkingGroup = document.getElementById('parking-group');
const parkingDetailsGroup = document.getElementById('parking-details-group');

propertyType.addEventListener('change', () => {
    const type = propertyType.value;
    // Hide all conditional groups
    carpetGroup.style.display = 'none';
    balconyGroup.style.display = 'none';
    parkingGroup.style.display = 'none';
    parkingDetailsGroup.style.display = 'none';

    // Show relevant groups for apartments, duplexes, individual homes
    if (['apartment', 'duplex', 'individual-home'].includes(type)) {
        carpetGroup.style.display = 'block';
        balconyGroup.style.display = 'block';
        parkingGroup.style.display = 'block';
    }
});

document.getElementById('parking').addEventListener('change', () => {
    if (document.getElementById('parking').value === 'yes') {
        parkingDetailsGroup.style.display = 'block';
    } else {
        parkingDetailsGroup.style.display = 'none';
    }
});

// Form Submission to Google Sheets
const form = document.getElementById('property-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Validate images (5-10, each <1MB)
    const images = formData.getAll('images');
    if (images.length < 5 || images.length > 10) {
        alert('Please upload between 5 and 10 images.');
        return;
    }
    for (let img of images) {
        if (img.size > 1024 * 1024) { // 1MB
            alert('Each image must be under 1MB.');
            return;
        }
    }

    // Prepare data for submission (images as URLs - in real setup, upload to cloud and get URLs)
    const data = {
        propertyType: formData.get('propertyType'),
        name: formData.get('name'),
        builder: formData.get('builder'),
        location: formData.get('location'),
        price: formData.get('price'),
        areaSize: formData.get('areaSize'),
        metric: formData.get('metric'),
        details: formData.get('details'),
        brochure: formData.get('brochure'), // In real setup, upload PDF and get URL
        carpetArea: formData.get('carpetArea') || '',
        balconyArea: formData.get('balconyArea') || '',
        parking: formData.get('parking'),
        parkingDetails: formData.get('parkingDetails') || '',
        images: images.map(img => URL.createObjectURL(img)) // Placeholder; replace with actual upload URLs
    };

    // Replace with your Google Apps Script web app URL for storing listings
    // Example: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=storeListing
    const url = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=storeListing';

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
        alert('Error submitting listing. Please try again.');
    }
});