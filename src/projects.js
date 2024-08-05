document.addEventListener("DOMContentLoaded", function() {
    // Initialize Tippy.js tooltips
    tippy('[data-tippy-content]', {
        placement: 'top',  // Tooltip position
        animation: 'fade', // Tooltip animation
        theme: 'light',    // Tooltip theme
        arrow: true        // Show arrow
    });

    // Dropdown and filter functionality
    var projectManagerMenu = document.getElementById("dropdownProjectManagerMenu");
    var projectManagerSet = new Set();
    var projectCustomerMenu = document.getElementById("dropdownProjectCustomerMenu");
    var projectCustomerSet = new Set();

    // Extract unique project managers from the table data
    var rows = document.querySelectorAll(".table tbody tr");
    rows.forEach(row => {
        var cells = row.getElementsByTagName("td");
        if (cells.length > 3) {
            var manager = cells[3].textContent.trim();
            projectManagerSet.add(manager);
        }
    });

    // Populate Project Manager dropdown
    projectManagerSet.forEach(manager => {
        var option = document.createElement("li");
        option.innerHTML = `<a class="dropdown-item" href="#">${manager}</a>`;
        projectManagerMenu.appendChild(option);
    });

    // Populate Project Customer dropdown
    rows.forEach(row => {
        var cells = row.getElementsByTagName("td");
        if (cells.length > 4) { // Ensure there is enough columns
            var customer = cells[4].textContent.trim();
            projectCustomerSet.add(customer);
        }
    });

    projectCustomerSet.forEach(customer => {
        var option = document.createElement("li");
        option.innerHTML = `<a class="dropdown-item" href="#">${customer}</a>`;
        projectCustomerMenu.appendChild(option);
    });

    // Event listener for dropdown items
    projectManagerMenu.addEventListener("click", function(event) {
        if (event.target && event.target.matches("a.dropdown-item")) {
            event.preventDefault();
            var filterValue = event.target.textContent;
            filterTable('manager', filterValue);
        }
    });

    projectCustomerMenu.addEventListener("click", function(event) {
        if (event.target && event.target.matches("a.dropdown-item")) {
            event.preventDefault();
            var filterValue = event.target.textContent;
            filterTable('customer', filterValue);
        }
    });

    // Function to filter table rows based on dropdown selection
    function filterTable(filterType, filterValue) {
        var rows = document.querySelectorAll(".table tbody tr");
        let found = false;
        rows.forEach(row => {
            var cells = row.getElementsByTagName("td");
            var manager = cells.length > 3 ? cells[3].textContent.trim() : '';
            var customer = cells.length > 4 ? cells[4].textContent.trim() : '';

            if (filterType === 'manager' && (manager === filterValue || filterValue === '')) {
                row.style.display = "";
                found = true;
            } else if (filterType === 'customer' && (customer === filterValue || filterValue === '')) {
                row.style.display = "";
                found = true;
            } else {
                row.style.display = "none";
            }
        });
        if (!found) noResultsFound();
    }

    // Notify user if no matching results found
    function noResultsFound() {
        alert("No results found for the selected filter or search query.");
    }
});
