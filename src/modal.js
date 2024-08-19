document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('editPayrollDateModal');
    const modal = new bootstrap.Modal(modalElement);
    const payrollDateInput = document.getElementById('payrollDateInput');
    const projectNumberInput = document.getElementById('projectNumberInput');
    const form = document.getElementById('editPayrollDateForm');

    document.querySelectorAll('.payroll-date').forEach(cell => {
        cell.addEventListener('click', function() {
            const projectNumber = this.dataset.projectNumber;
            const payrollDate = this.dataset.payrollDate;
            
            
            payrollDateInput.value = payrollDate;
            projectNumberInput.value = projectNumber;

            modal.show();
        });
    });
    function hideModal() {
        modal.hide();
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const newDate = payrollDateInput.value;
        const projectNumber = projectNumberInput.value;

        try {
            const response = await updatePayrollDate(projectNumber, newDate);

            if (response.ok) {
                const cell = document.querySelector(`td[data-project-number="${projectNumber}"]`);

                if (cell) {
                    cell.innerText = newDate;
                    cell.setAttribute('data-payroll-date', newDate);
                    updateDaysOld(cell);
                } else {
                    console.error(`Table cell with project number ${projectNumber} not found.`);
                }
                hideModal();
            } else {
                const errorText = await response.text();
                showAlert(`Failed to update the payroll date: ${errorText}`, 'danger');
            }
        } catch (error) {
            console.error('Error updating payroll date:', error);
            showAlert('An error occurred while updating the payroll date.', 'danger');
        }
    });

    async function updatePayrollDate(projectNumber, newDate) {
        try {
            const response = await fetch('/update-payroll-date', {
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

    function updateDaysOld(cell) {
        const payrollDateStr = cell.dataset.payrollDate;
        const payrollDate = new Date(payrollDateStr);
        const today = new Date();
        const timeDiff = today - payrollDate;
        const daysOld = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        const daysOldText = ` (${daysOld})`;

        if (daysOld > 7) {
            cell.classList.add('text-danger');
            cell.classList.remove('text-success');
        } else {
            cell.classList.add('text-success');
            cell.classList.remove('text-danger');
        }

        cell.innerHTML = cell.innerHTML.replace(/\(\d+\)$/, '') + daysOldText;
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
        
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000); 
    }

    modalElement.addEventListener('hidden.bs.modal', function() {
        payrollDateInput.value = '';
        projectNumberInput.value = '';
    });
});
