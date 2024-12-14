document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortBy');
    const filterSelect = document.getElementById('filterBy');
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const downloadSelectedBtn = document.getElementById('downloadSelected');
    const screenshotGrid = document.getElementById('screenshotGrid');

    // Load screenshots
    function loadScreenshots(page = 1) {
        const params = new URLSearchParams({
            search: searchInput.value,
            sort: sortSelect.value,
            filter: filterSelect.value,
            page: page
        });

        fetch(`/api/screenshots?${params}`)
            .then(response => response.json())
            .then(data => {
                updateScreenshotGrid(data.screenshots);
                updatePagination(data.totalPages, page);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error loading screenshots');
            });
    }

    // Update screenshot grid
    function updateScreenshotGrid(screenshots) {
        screenshotGrid.innerHTML = screenshots.map(screenshot => `
            <div class="col">
                <div class="card h-100">
                    <img src="${screenshot.url}" class="card-img-top" alt="${screenshot.name}">
                    <div class="card-body">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${screenshot.id}">
                            <h5 class="card-title">${screenshot.name}</h5>
                        </div>
                        <p class="card-text">
                            <small class="text-muted">Captured: ${new Date(screenshot.timestamp).toLocaleString()}</small>
                        </p>
                    </div>
                    <div class="card-footer">
                        <div class="btn-group btn-group-sm w-100">
                            <button class="btn btn-outline-primary" onclick="viewScreenshot(${screenshot.id})">View</button>
                            <button class="btn btn-outline-secondary" onclick="downloadScreenshot(${screenshot.id})">Download</button>
                            <button class="btn btn-outline-danger" onclick="deleteScreenshot(${screenshot.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update pagination
    function updatePagination(totalPages, currentPage) {
        // Implementation for pagination updates
    }

    // Handle search
    searchInput.addEventListener('input', debounce(() => {
        loadScreenshots();
    }, 300));

    // Handle sort and filter changes
    sortSelect.addEventListener('change', () => loadScreenshots());
    filterSelect.addEventListener('change', () => loadScreenshots());

    // Handle bulk actions
    deleteSelectedBtn.addEventListener('click', function() {
        const selected = getSelectedScreenshots();
        if (selected.length === 0) {
            alert('Please select screenshots to delete');
            return;
        }

        if (confirm('Are you sure you want to delete the selected screenshots?')) {
            fetch('/api/screenshots/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selected })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadScreenshots();
                } else {
                    alert('Error deleting screenshots');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting screenshots');
            });
        }
    });

    // Helper function to get selected screenshots
    function getSelectedScreenshots() {
        const checkboxes = document.querySelectorAll('.form-check-input:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initial load
    loadScreenshots();
});
