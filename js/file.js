async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) {
        alert("Selecciona un archivo.");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("archivo", file);

    const fileName = file.name.toLowerCase();
    
    if (file && formData && fileName) {
        try {
            await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData
            });
            alert("Archivo subido correctamente");
            

        } catch (error) {
            alert("Error al subir el archivo: " + error);
        }
    } else {
        alert("Tipo de archivo no soportado.");
    }
}

function showTableData(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const tableHeaders = document.getElementById("tableHeaders");
        tableHeaders.innerHTML = ""; 

        headers.forEach(header => {
            const th = document.createElement("th");
            th.innerText = header;
            tableHeaders.appendChild(th);
        });

        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                td.innerText = row[header] || ""; 
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        tableBody.innerHTML = "<tr><td colspan='100%'>No hay datos disponibles.</td></tr>";
    }
}

function showFiles() {
    fetch("http://localhost:3000/archivos")
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById("fileList");
            fileList.innerHTML = ""; 

            if (data.length === 0) {
                fileList.innerHTML = "<p>No hay archivos almacenados.</p>";
                return;
            }

            const list = document.createElement("ul");
            list.className = "list-group";

            data.forEach(file => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.innerHTML = `
                    ${file.nombre} (${new Date(file.fecha).toLocaleString()})
                    <button class="btn btn-sm btn-success float-right" onclick="downloadFile(${file.id})">Descargar</button>
                `;
                list.appendChild(listItem);
            });

            fileList.appendChild(list);
        })
        .catch(err => console.error(err));
}

function downloadFile(fileId) {
    fetch(`http://localhost:3000/archivo/${fileId}`)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `archivo_${fileId}`; 
            link.click(); 
        })
        .catch(err => {
            console.error(err);
            alert("No se pudo descargar el archivo.");
        });
}

document.getElementById("showFilesBtn").addEventListener("click", () => {
    document.getElementById("filePopup").style.display = "block"; 
    showFiles(); 
});

function closePopup() {
    document.getElementById("filePopup").style.display = "none"; // Ocultar el pop-up
}

function viewFile(fileId) {
    window.open(`http://localhost:3000/archivo/${fileId}`, "_blank");
}
