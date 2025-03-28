document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal
    initializeSubModal();
    
    // Initialize all dates on load
    initSubDates();
});

function initializeSubModal() {
    const modal = new bootstrap.Modal(document.getElementById('editSubPayrollDateModal'));
    const form = document.getElementById('editSubPayrollDateForm');

    // Click handler for table cells
    document.querySelectorAll('.subpayroll-date').forEach(cell => {
        cell.addEventListener('click', function() {
            document.getElementById('subPayrollDateInput').value = this.dataset.subpayrollDate || '';
            document.getElementById('projectNumberInput').value = this.dataset.projectNumber || '';
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const projectNumber = document.getElementById('projectNumberInput').value;
        const newDate = document.getElementById('subPayrollDateInput').value;

        try {
            const response = await fetch('/update-subpayroll-date', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectNumber, newDate })
            });

            if (response.ok) {
                const cell = document.querySelector(`.subpayroll-date[data-project-number="${projectNumber}"]`);
                if (cell) {
                    cell.dataset.subpayrollDate = newDate;
                    updateSubDateDisplay(cell);
                }
                modal.hide();
            } else {
                showAlert('Failed to update date', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred', 'danger');
        }
    });
}

function initSubDates() {
    document.querySelectorAll('.subpayroll-date').forEach(cell => {
        updateSubDateDisplay(cell);
    });
}

function updateSubDateDisplay(cell) {
    const dateStr = cell.dataset.subpayrollDate;
    
    if (!dateStr) {
        cell.textContent = '';
        cell.classList.remove('text-danger', 'text-success');
        return;
    }

    try {
        // Create date in UTC to avoid timezone issues
        const date = new Date(dateStr + 'T00:00:00Z');
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        
        const daysOld = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        const formattedDate = date.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        cell.innerHTML = `${formattedDate} (${daysOld})`;
        cell.classList.toggle('text-danger', daysOld > 7);
        cell.classList.toggle('text-success', daysOld <= 7);
    } catch (e) {
        console.error('Invalid date:', dateStr, e);
        cell.textContent = 'Invalid Date';
        cell.classList.remove('text-danger', 'text-success');
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}