document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileName = file.name.toLowerCase();
        
        if (fileName.endsWith('.xlsx')) {
            readXlsx(file);
        } else if (fileName.endsWith('.csv')) {
            readCsv(file);
        } else if (fileName.endsWith('.html')) {
            readHtml(file);
        } else {
            alert("Tipo de archivo no soportado.");
        }
    }
});

function readXlsx(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        
        cargarDatosEnTabla(json);
    };
    reader.readAsBinaryString(file);
}

function readCsv(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        Papa.parse(text, {
            complete: function(results) {
                cargarDatosEnTabla(results.data);
            },
            header: true 
        });
    };
    reader.readAsText(file);
}

function readHtml(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target.result, "text/html");
        const table = doc.querySelector("table");

        if (table) {
            cargarDatosDesdeTabla(table);
        } else {
            alert("No se encontró ninguna tabla en el archivo HTML.");
        }
    };
    reader.readAsText(file);
}

function cargarDatosEnTabla(data) {
    const tableHeaders = document.getElementById("tableHeaders");
    const tableBody = document.getElementById("tableBody");

    tableHeaders.innerHTML = "";  
    tableBody.innerHTML = "";     

    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        headers.forEach(header => {
            const th = document.createElement("th");
            th.innerText = header;
            tableHeaders.appendChild(th);
        });

        data.forEach(rowData => {
            const row = document.createElement("tr");
            headers.forEach(header => {
                const cell = document.createElement("td");
                cell.innerText = rowData[header] || "";
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = "<tr><td colspan='100%'>No se encontraron datos.</td></tr>";
    }
}

function cargarDatosDesdeTabla(table) {
    const headers = Array.from(table.querySelectorAll("thead tr th")).map(th => th.innerText.trim());
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(tr =>
        Array.from(tr.querySelectorAll("td")).map(td => td.innerText.trim())
    );

    const tableHeaders = document.getElementById("tableHeaders");
    tableHeaders.innerHTML = "";  
    headers.forEach(header => {
        const th = document.createElement("th");
        th.innerText = header;
        tableHeaders.appendChild(th);
    });

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; 
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

function openForm() {
    document.getElementById("myMenu").style.display = "block";
}

function closeForm() {
    document.getElementById("myMenu").style.display = "none";
}
