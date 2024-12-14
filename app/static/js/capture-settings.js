document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('captureSettingsForm');
    const startButton = document.getElementById('startCapture');
    const intervalSelect = document.getElementById('captureInterval');
    const autoDetectionToggle = document.getElementById('autoDetection');
    const saveLocationInput = document.getElementById('saveLocation');
    const browseButton = document.getElementById('browsePath');
    const qualitySlider = document.getElementById('imageQuality');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const settings = {
            captureInterval: intervalSelect.value,
            autoDetection: autoDetectionToggle.checked,
            saveLocation: saveLocationInput.value,
            imageQuality: qualitySlider.value
        };
        
        // Save settings to backend
        fetch('/api/save-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Settings saved successfully!');
            } else {
                alert('Error saving settings');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving settings');
        });
    });

    // Handle start capture button
    startButton.addEventListener('click', function() {
        fetch('/api/start-capture', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/screenshot-manager';
            } else {
                alert('Error starting capture');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error starting capture');
        });
    });

    // Handle browse button
    browseButton.addEventListener('click', function() {
        // In a real implementation, this would open a file dialog
        alert('File dialog functionality will be implemented');
    });

    // Update quality display
    qualitySlider.addEventListener('input', function() {
        this.title = `Quality: ${this.value}%`;
    });
});
