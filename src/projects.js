document.addEventListener("DOMContentLoaded", function() {
    tippy('[data-tippy-content]', {
        placement: 'right',
        animation: 'perspective',
        theme: 'material',
        arrow: true,
        allowHTML: true
    });

    const projectManagerMenu = document.getElementById("dropdownProjectManagerMenu");
    const projectCustomerMenu = document.getElementById("dropdownProjectCustomerMenu");

    if (!projectManagerMenu || !projectCustomerMenu) {
        console.error("Dropdown menus not found.");
        return;
    }

    const projectManagerSet = new Set();
    const projectCustomerSet = new Set();

    const rows = document.querySelectorAll(".table tbody tr");

    if (rows.length === 0) {
        console.warn("No rows found in the table.");
    }

    rows.forEach(row => {
    
        const managerCell = row.querySelector("#projectManagerList");
        const customerCell = row.querySelector("#customerList");

        const manager = managerCell ? managerCell.textContent.trim() : '';
        const customer = customerCell ? customerCell.textContent.trim() : '';

        if (manager) projectManagerSet.add(manager);
        if (customer) projectCustomerSet.add(customer);
    });

    if (projectManagerSet.size === 0) {
        console.warn("No project managers found.");
    }

    if (projectCustomerSet.size === 0) {
        console.warn("No project customers found.");
    }

    populateDropdown(projectManagerMenu, projectManagerSet);
    populateDropdown(projectCustomerMenu, projectCustomerSet);

    projectManagerMenu.addEventListener("click", event => handleDropdownClick(event, 'manager'));
    projectCustomerMenu.addEventListener("click", event => handleDropdownClick(event, 'customer'));

    function populateDropdown(menu, itemsSet) {
        itemsSet.forEach(item => {
            const option = document.createElement("li");
            option.innerHTML = `<a class="dropdown-item" href="#">${item}</a>`;
            menu.appendChild(option);
        });
    }

    function handleDropdownClick(event, filterType) {
        if (event.target && event.target.matches("a.dropdown-item")) {
            event.preventDefault();
            const filterValue = event.target.textContent;
            filterTable(filterType, filterValue);
        }
    }

    function filterTable(filterType, filterValue) {
        const rows = document.querySelectorAll(".table tbody tr:not(.nested-row)");
        let found = false;
        const searchQuery = searchInput.value.trim().toLowerCase();

        rows.forEach(row => {
            const managerCell = row.querySelector("#projectManagerList");
            const customerCell = row.querySelector("#customerList");

            const manager = managerCell ? managerCell.textContent.trim().toLowerCase() : '';
            const customer = customerCell ? customerCell.textContent.trim().toLowerCase() : '';

            const matchesFilter = (filterType === 'manager' && (manager === filterValue.toLowerCase() || filterValue === ''))
                || (filterType === 'customer' && (customer === filterValue.toLowerCase() || filterValue === ''));

            const matchesSearch = Array.from(row.getElementsByTagName("td")).some(cell => {
                return cell.textContent.trim().toLowerCase().includes(searchQuery);
            });

            if ((matchesFilter || !filterType) && (matchesSearch || !searchQuery)) {
                row.style.display = "";
                found = true;
            } else {
                row.style.display = "none";
            }
        });

        if (!found) {
            console.log("No results found for the selected filter or search query.");
        }
    }
});
