document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(e.target.result, "text/html");

            // Suponemos que la tabla está en el primer elemento <table> del archivo HTML
            const table = doc.querySelector("table");

            if (table) {
                cargarDatosDesdeTabla(table);
            } else {
                alert("No se encontró ninguna tabla en el archivo HTML.");
            }
        };
        reader.readAsText(file);
    }
});

function cargarDatosDesdeTabla(table) {
    const headers = Array.from(table.querySelectorAll("thead tr th")).map(th => th.innerText.trim());
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(tr => 
        Array.from(tr.querySelectorAll("td")).map(td => td.innerText.trim())
    );

    // Crear encabezados personalizados
    const tableHeaders = document.getElementById("tableHeaders");
    tableHeaders.innerHTML = ""; // Limpiar encabezados anteriores
    headers.forEach(header => {
        const th = document.createElement("th");
        const headerText = titulosPersonalizados[header] || titulosPersonalizados[header.replace(/\s/g, '')] || header;
        th.innerText = headerText;
        tableHeaders.appendChild(th);
    });

    // Llenar la tabla con datos
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Limpiar contenido previo
    rows.forEach(rowData => {
        const row = document.createElement("tr");
        rowData.forEach(cellData => {
            const cell = document.createElement("td");
            cell.innerText = cellData;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}


//popup
function openForm() {
    document.getElementById("myMenu").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myMenu").style.display = "none";
  }