document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('#projectTableBody tr');

    rows.forEach(row => {
        // Calculate days old for payroll date
        const payrollDateStr = row.dataset.payrolldate;
        const payrollDate = new Date(payrollDateStr);
        const payrollCell = row.querySelector('.payroll-days-old');

        if (!isNaN(payrollDate.getTime())) {
            const today = new Date();
            const timeDiff = today - payrollDate;
            const daysOld = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            payrollCell.innerHTML += ` (${daysOld})`;

            if (daysOld > 7) {
                payrollCell.classList.add('text-danger');
            } else {
                payrollCell.classList.add('text-success');
            }
        }

        // Determine and set the icon for DAS status
        const dasonsiteDateStr = row.dataset.dasonsitedate;
        const actualonsiteDateStr = row.dataset.actualonsitedate;
        const dasfileDateStr = row.dataset.dasfiledate;

        const dasonsiteDate = dasonsiteDateStr ? new Date(dasonsiteDateStr) : null;
        const actualonsiteDate = actualonsiteDateStr ? new Date(actualonsiteDateStr) : null;
        const dasfileDate = dasfileDateStr ? new Date(dasfileDateStr) : null;

        const dasCell = row.querySelector('#dasStatus');

        const setIcon = (colorClass, iconPath) => {
            dasCell.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg ${colorClass}" viewBox="0 0 16 16">
                    <path d="${iconPath}"/>
                </svg>`;
        };
        if (dasfileDate) {
            if (dasonsiteDate && actualonsiteDate) {
                if (dasonsiteDate.getTime() === actualonsiteDate.getTime()) {
                    setIcon('text-success', 'M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z');
                } else {
                    setIcon('text-danger', 'M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z');
                }
            } else {
                setIcon('', 'M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z');
            }
        } else {
            setIcon('text-danger', 'M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z');
        }
    });
});
