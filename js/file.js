// Función para subir el archivo
function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) {
        alert("Selecciona un archivo.");
        return;
    }

    const formData = new FormData();
    formData.append("archivo", fileInput.files[0]);

    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        fileInput.value = ""; // Limpiar el input
    })
    .catch(err => console.error(err));
}

function showFiles() {
    fetch("http://localhost:3000/archivos")
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById("fileList");
            fileList.innerHTML = ""; // Limpiar la lista actual

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

// Función para descargar el archivo
function downloadFile(fileId) {
    fetch(`http://localhost:3000/archivo/${fileId}`)
        .then(response => response.blob()) // Obtener el archivo como blob para descargar
        .then(blob => {
            // Crear un enlace de descarga
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `archivo_${fileId}`; // Nombre de descarga (puedes personalizarlo)
            link.click(); // Simula el clic en el enlace para iniciar la descarga
        })
        .catch(err => {
            console.error(err);
            alert("No se pudo descargar el archivo.");
        });
}

// Función para abrir el pop-up
document.getElementById("showFilesBtn").addEventListener("click", () => {
    document.getElementById("filePopup").style.display = "block"; // Mostrar el pop-up
    showFiles(); // Llamar a la función para cargar los archivos
});

// Función para cerrar el pop-up
function closePopup() {
    document.getElementById("filePopup").style.display = "none"; // Ocultar el pop-up
}

// Función para ver el archivo
function viewFile(fileId) {
    window.open(`http://localhost:3000/archivo/${fileId}`, "_blank");
}
