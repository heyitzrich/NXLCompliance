document.addEventListener('DOMContentLoaded', function() {
    // Initialize the payroll dates modal
    initializeModal({
        modalId: 'editPayrollDateModal',
        dateInputId: 'payrollDateInput',
        projectNumberInputId: 'projectNumberInput',
        formId: 'editPayrollDateForm',
        cellSelector: '.payroll-date',
        updateEndpoint: '/update-payroll-date'
    });
});

function initializeModal(config) {
    const modalElement = document.getElementById(config.modalId);
    const modal = new bootstrap.Modal(modalElement);
    const dateInput = document.getElementById(config.dateInputId);
    const projectNumberInput = document.getElementById(config.projectNumberInputId);
    const form = document.getElementById(config.formId);

    // Add click event listeners to the table cells
    document.querySelectorAll(config.cellSelector).forEach(cell => {
        cell.addEventListener('click', function() {
            const projectNumber = this.dataset.projectNumber;
            const dateValue = this.dataset.payrollDate;

            // Populate the modal inputs
            dateInput.value = dateValue;
            projectNumberInput.value = projectNumber;

            // Show the modal
            modal.show();
        });
    });

    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const newDate = dateInput.value;
        const projectNumber = projectNumberInput.value;

        try {
            const response = await updateDate(config.updateEndpoint, projectNumber, newDate);

            if (response.ok) {
                // Find the table cell and update its content
                const cell = document.querySelector(`${config.cellSelector}[data-project-number="${projectNumber}"]`);

                if (cell) {
                    // Format the date before displaying (MM/DD/YYYY format)
                    const formattedDate = formatDateForDisplay(newDate);
                    cell.innerText = formattedDate;
                    cell.setAttribute('data-payroll-date', newDate);
                    updateDaysOld(cell); // Update the "days old" display
                } else {
                    console.error(`Table cell with project number ${projectNumber} not found.`);
                }

                // Hide the modal
                hideModal(modal);
            } else {
                const errorText = await response.text();
                showAlert(`Failed to update the date: ${errorText}`, 'danger');
            }
        } catch (error) {
            console.error('Error updating date:', error);
            showAlert('An error occurred while updating the date.', 'danger');
        }
    });

    // Reset the modal when it's hidden
    modalElement.addEventListener('hidden.bs.modal', function() {
        dateInput.value = '';
        projectNumberInput.value = '';
    });
}

// Helper function to format date as MM/DD/YYYY
function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    
    // Create date in UTC to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

async function updateDate(endpoint, projectNumber, newDate) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectNumber: projectNumber,
                newDate: newDate
            })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function hideModal(modal) {
    modal.hide();
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

function updateDaysOld(cell) {
    const dateStr = cell.dataset.payrollDate;
    if (!dateStr) return;

    // Create dates in UTC
    const date = new Date(dateStr + 'T00:00:00Z');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight
    
    // Calculate days difference in UTC
    const timeDiff = today - date;
    const daysOld = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const daysOldText = ` (${daysOld})`;

    if (daysOld > 7) {
        cell.classList.add('text-danger');
        cell.classList.remove('text-success');
    } else {
        cell.classList.add('text-success');
        cell.classList.remove('text-danger');
    }

    // Get the current displayed date (without the days old part)
    const currentText = cell.innerText.split(' (')[0];
    cell.innerHTML = currentText + daysOldText;
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}