document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get("request_id");

  if (requestId) {
    fetchRequestDetails(requestId);
  } else {
    alert("No se proporcionó un ID de solicitud.");
  }
});

function fetchRequestDetails(requestId) {
  fetch(`get_request_details.php?request_id=${requestId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Error cargando la solicitud.");
        return;
      }

      // show request details
      document.getElementById("request-date").textContent = data.created_at;
      document.getElementById("request-user").textContent = data.email;
      document.getElementById("request-deadline").textContent = data.deadline;
      document.getElementById("request-purpose").textContent = data.purpose;

      // Show assets
      const container = document.getElementById("assetCardsContainer");
      container.innerHTML = "<h2>SELECTED ASSETS</h2>"; // clean previous content

      data.assets.forEach(async asset => {
        const card = document.createElement("div");
        card.classList.add("asset-card");

        const preview = document.createElement("div");
        preview.classList.add("preview");

        const img = document.createElement("img");
        img.src = asset.file_path;
        img.alt = asset.name;
        img.classList.add("preview");
        preview.appendChild(img);

        const resolution = await getImageResolution(asset.file_path);

        const info = document.createElement("div");
        info.classList.add("asset-info");

        info.innerHTML = `
            <strong>${asset.name}</strong>
            <p>TYPE: ${asset.type}</p>
            <p>FORMAT: ${getFileExtension(asset.file_path).toUpperCase()}</p>
            <p>RESOLUTION: ${resolution}</p>
        `;

        const icon = document.createElement("span");
        icon.className = "material-symbols-outlined";
        icon.textContent = "check_box";

        card.appendChild(preview);
        card.appendChild(info);
        card.appendChild(icon);
        container.appendChild(card);
        });
    });
}

function getFileExtension(filename) {
  return filename.split('.').pop();
}

function getImageResolution(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(`${img.naturalWidth}x${img.naturalHeight}`);
    };
    img.onerror = reject;
    img.src = url;
  });
}