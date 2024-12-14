// UI Helper Functions
const uiHelpers = {
    // Show Alert
    showAlert: function(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-float alert-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Animate in
        setTimeout(() => alertDiv.classList.add('show'), 10);
        
        // Auto dismiss
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
        
        // Close button
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        });
    },
    
    // Show Success
    showSuccess: function(title, message) {
        this.showAlert(message, 'success');
    },
    
    // Show/Hide Loading
    showLoading: function(title, message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingOverlay';
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="spinner-modern"></div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(loadingDiv);
        setTimeout(() => loadingDiv.classList.add('show'), 10);
    },
    
    hideLoading: function() {
        const loadingDiv = document.getElementById('loadingOverlay');
        if (loadingDiv) {
            loadingDiv.classList.remove('show');
            setTimeout(() => loadingDiv.remove(), 300);
        }
    }
};

// Add styles
const style = document.createElement('style');
style.textContent = `
    .alert-float {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 1050;
        transform: translateY(-100%);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .alert-float.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .alert-error {
        border-left: 4px solid var(--error-color);
    }
    
    .alert-success {
        border-left: 4px solid var(--success-color);
    }
    
    .alert-close {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
    }
    
    .alert-close:hover {
        opacity: 1;
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1060;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .loading-overlay.show {
        opacity: 1;
    }
    
    .loading-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
    }
    
    .loading-content h3 {
        margin: 1rem 0 0.5rem;
    }
    
    .loading-content p {
        color: var(--text-secondary);
        margin: 0;
    }
`;

document.head.appendChild(style);

// Export for use in other files
window.uiHelpers = uiHelpers;
