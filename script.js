function scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}
// Google Sheets Integration
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // You'll add this after I show you setup

// Modal functionality
function openModal(packageType = '') {
    document.getElementById('emailModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Pre-select package if specified
    if (packageType && document.getElementById('package')) {
        document.getElementById('package').value = packageType;
    }
}

function closeModal() {
    document.getElementById('emailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('emailModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Smooth scroll helper
function scrollTo(id) {
    document.getElementById(id).scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Form submission with Google Sheets integration
function submitForm(event) {
    event.preventDefault();
    
    const formData = {
        timestamp: new Date().toLocaleString(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        business: document.getElementById('business').value,
        package: document.getElementById('package').value,
        message: document.getElementById('message').value || 'N/A'
    };
    
    // Send to Google Sheets (if URL is configured)
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
    }
    
    // Also create mailto as backup
    const subject = `New Lead: ${formData.business} - ${formData.name}`;
    const body = `
New ReinNSolutions Lead:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Business: ${formData.business}
Interested In: ${formData.package}
Message: ${formData.message}

Time: ${formData.timestamp}
    `.trim();
    
    const mailtoLink = `mailto:gabriel@elevatedlivesinc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('✅ Lead captured! Opening your email now. We\'ll respond within 5 minutes!');
    
    // Close modal and reset form
    closeModal();
    document.getElementById('leadForm').reset();
}

// Newsletter submission
function submitNewsletter(event) {
    event.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    
    const newsletterData = {
        timestamp: new Date().toLocaleString(),
        email: email,
        source: 'Newsletter Signup'
    };
    
    // Send to Google Sheets (if configured)
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newsletterData)
        });
    }
    
    // Create mailto
    const subject = 'New Newsletter Signup';
    const body = `New newsletter signup: ${email}\nTime: ${newsletterData.timestamp}`;
    const mailtoLink = `mailto:gabriel@elevatedlivesinc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    
    alert('✅ You\'re in! First issue of The Solutionist hits your inbox this week.');
    document.getElementById('newsletter-email').value = '';
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.starter-card, .win-card, .testimonial-card, .faq-item, .timeline-item, .menu-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
