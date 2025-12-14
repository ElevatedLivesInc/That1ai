// Modal functionality
function openModal() {
    document.getElementById('emailModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
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

// Smooth scroll to proof section
function scrollToProof() {
    document.getElementById('proof').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Form submission
function submitForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        business: document.getElementById('business').value,
        urgency: document.getElementById('urgency').value
    };
    
    // Create mailto link with all info
    const subject = `New Lead: ${formData.business} - ${formData.name}`;
    const body = `
New ReinSolutions Lead:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Business: ${formData.business}
Timeline: ${formData.urgency}

Time: ${new Date().toLocaleString()}
    `.trim();
    
    const mailtoLink = `mailto:gabriel@elevatedlivesinc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('✅ Opening your email now! We\'ll respond within 5 minutes. Check your inbox soon!');
    
    // Close modal and reset form
    closeModal();
    document.getElementById('leadForm').reset();
}

// Add scroll animations
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

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.problem-card, .testimonial-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
