document.addEventListener("DOMContentLoaded", () => {
    fetch("get_requests.php")
        .then(response => response.json())
        .then(data => {
            console.log("Data recibida:", data);

            const container = document.querySelector(".requests");

            if (!Array.isArray(data)) {
                console.error("El formato de datos no es un arreglo:", data);
                return;
            }

            if (data.length === 0) {
                container.innerHTML = "<p>No hay solicitudes registradas.</p>";
                return;
            }

            data.forEach(request => {
                const card = document.createElement("div");
                card.classList.add("request-card");
                card.innerHTML = `
                    <p>${new Date(request.created_at).toLocaleDateString()}</p>
                    <p>${request.quantity}</p>
                    <p>${request.deadline}</p>
                    <p class="status">${request.status}</p> 
                `;
                container.appendChild(card);

                // change the color of the status text based on the request status
                const statusColor = {
                    pending: "#FF7A27",
                    approved: "#23C01B",
                    rejected: "#FF0101"
                };

                const statusElement = card.querySelector(".status");
                const color = statusColor[request.status] || "black";
                statusElement.style.color = color;
            });
        })
        .catch(error => {
            console.error("Error al obtener las solicitudes:", error);
        });
});