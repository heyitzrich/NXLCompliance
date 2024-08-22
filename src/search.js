document.getElementById("searchInput").addEventListener("keyup", function() {
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.querySelector(".table");
  
  if (!table) return;
  var tbody = table.querySelector("tbody");
  if (!tbody) return;

  var tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    if (tr[i].classList.contains('nested-row') || tr[i].closest('.collapse')) {
        continue;
    }
      var showRow = false; 
      td = tr[i].getElementsByTagName("td");
      for (j = 0; j < td.length; j++) {
          if (td[j]) {
              txtValue = td[j].textContent || td[j].innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  showRow = true; 
                  break; 
              }
          }
      }
      if (showRow) {
          tr[i].style.display = "";
      } else {
          tr[i].style.display = "none";
      }
  }
});