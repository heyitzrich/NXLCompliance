
document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('editPayrollDateModal');
    const modal = new bootstrap.Modal(modalElement);
    const payrollDateInput = document.getElementById('payrollDateInput');
    const projectNumberInput = document.getElementById('projectNumberInput');
    const form = document.getElementById('editPayrollDateForm');

function formatDateForDisplay(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${month}-${day}-${year}`;
}

    document.querySelectorAll('.payroll-date').forEach(cell => {
        cell.addEventListener('click', function() {
            const projectNumber = this.dataset.projectNumber;
            const payrollDate = this.dataset.payrollDate;

            payrollDateInput.value = payrollDate;
            projectNumberInput.value = projectNumber;

            modal.show();
        });
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const newDate = formatDateForDisplay(payrollDateInput.value);
        const projectNumber = projectNumberInput.value;


        try {
            const response = await updatePayrollDate(projectNumber, newDate);

            if (response.ok) {
                const cell = document.querySelector(`td[data-project-number="${projectNumber}"]`);

                if (cell) {
                    cell.innerText = newDate;
                    cell.setAttribute('data-payroll-date', newDate);
                    updateDaysOld(cell);  // Update the "days old" display
                } else {
                    console.error(`Table cell with project number ${projectNumber} not found.`);
                }
                modal.hide();
            } else {
                const errorText = await response.text();
                alert(`Failed to update the payroll date: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating payroll date:', error);
            alert('An error occurred while updating the payroll date.');
        }
    });



    async function updatePayrollDate(projectNumber, newDate) {
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
        return response;
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

        cell.innerHTML = cell.innerHTML.replace(/\(\d+\)$/, '') + daysOldText; // Replace old days count with new
    }
});

