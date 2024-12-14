// Utility Functions
function showLoading(message = 'Processing...') {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.querySelector('h4').textContent = message;
        overlay.classList.remove('d-none');
    }
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.add('d-none');
    }
}

function showAlert(type, message, duration = 5000) {
    const alert = document.createElement('div');
    alert.className = `alert-modern alert-modern-${type} mb-4`;
    alert.textContent = message;
    
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alert, main.firstChild);
        setTimeout(() => alert.remove(), duration);
    }
}

// Animation Functions
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => observer.observe(element));
}

// Form Handling
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                try {
                    // Add your form submission logic here
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
                    showAlert('success', 'Form submitted successfully!');
                } catch (error) {
                    showAlert('error', 'An error occurred. Please try again.');
                } finally {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }
            }
        });
    });
}

// Progress Bar Animation
function updateProgress(percentage) {
    const progressBar = document.querySelector('.progress-modern .progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Theme Toggle
function initializeThemeToggle() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme(e) {
        document.body.classList.toggle('dark-theme', e.matches);
    }
    
    prefersDark.addListener(updateTheme);
    updateTheme(prefersDark);
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeForms();
    initializeThemeToggle();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle feedback button click
    document.querySelector('.btn-outline-primary').addEventListener('click', function() {
        alert('Feedback functionality will be implemented soon!');
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle YouTube URL submission
    const youtubeForm = document.querySelector('.video-input-section form');
    if (youtubeForm) {
        youtubeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const url = this.querySelector('input').value;
            
            if (!url) {
                alert('Please enter a YouTube URL');
                return;
            }

            showLoading();
            fetch('/api/process-youtube', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    hideLoading();
                    alert(data.error || 'Error processing video');
                }
            })
            .catch(error => {
                hideLoading();
                console.error('Error:', error);
                alert('Error processing video');
            });
        });
    }
});
