document.addEventListener("DOMContentLoaded", () => {
    fetch("get_admin_requests.php")
        .then(response => response.json())
        .then(data => {
            console.log("Data received:", data);

            const container = document.querySelector(".requests");

            if (!Array.isArray(data)) {
                console.error("The data format is not an array:", data);
                return;
            }

            if (data.length === 0) {
                container.innerHTML = "<p>No requests registered.</p>";
                return;
            }

            data.forEach(request => {
                const card = document.createElement("div");
                card.classList.add("request-card");

                // Set the data-id attribute
                card.setAttribute("data-id", request.id);

                // Status color styling
                const statusText = request.status === "pending" ? "pending" : "resolved";
                const statusColor = request.status === "pending" ? "#FF7A27" : "#23C01B";

                card.innerHTML = `
                    <p>${new Date(request.created_at).toLocaleDateString()}</p>
                    <p>${request.email}</p>
                    <p>${request.deadline}</p>
                    <p class="status" style="color: ${statusColor};">${statusText}</p>
                `;

                // Redirect on click
                card.addEventListener("click", () => {
                    const requestId = card.getAttribute("data-id");
                    window.location.href = `admin_asset_request.html?request_id=${requestId}`;
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching requests:", error);
        });
});
