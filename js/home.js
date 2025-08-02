let assets = [];
let activeFilter = null;
let searchTerm = "";

const container = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");

// verify if the container exists
if (!container) {
  console.error("No container found with id 'grid'");
}

// obtain assets from the server
fetch("get_assets.php")
  .then(response => response.json())
  .then(data => {
    assets = data;
    renderAssets();
  })
  .catch(error => {
    console.error("Error loading assets:", error);
    if (container) container.innerHTML = "<p>Error loading assets.</p>";
  });

function renderAssets() {
  if (!container) return;

  container.innerHTML = "";

  const filtered = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !activeFilter || asset.type === activeFilter;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No assets found.</p>";
    return;
  }

  filtered.forEach(asset => {
        const card = document.createElement("div");
        card.classList.add("card");

        let mediaElement;

        if (asset.type.startsWith("image")) {
            mediaElement = document.createElement("img");
            mediaElement.src = asset.file_path;
            mediaElement.alt = asset.name;
        } else if (asset.type.startsWith("video")) {
            mediaElement = document.createElement("video");
            mediaElement.src = asset.file_path;
            mediaElement.controls = true;
        } else if (asset.type.startsWith("vector")) {
            mediaElement = document.createElement("img");
            mediaElement.src = asset.file_path;
            mediaElement.alt = asset.name;
        }

        if (mediaElement) {
            mediaElement.classList.add("clickable-media");
            mediaElement.addEventListener("click", () => openOverlay(asset));
            card.appendChild(mediaElement);
        }

        const nameLabel = document.createElement("p");
        nameLabel.textContent = asset.name;
        card.appendChild(nameLabel);

        container.appendChild(card);
    });
}

// Search input event listener
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderAssets();
  });
}

// Filter buttons event listeners
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");

    // Toggle active filter
    if (activeFilter === type) {
      activeFilter = null;
    } else {
      activeFilter = type;
    }

    // Update active class
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });
    if (activeFilter) {
      button.classList.add("active");
    }

    renderAssets();
  });

  
});

let selectedAssetId = null;

const addToRequestBtn = document.getElementById("addToRequestBtn");

    if (addToRequestBtn) {
      addToRequestBtn.addEventListener("click", () => {
        if (!selectedAssetId) return;

        fetch("add_to_cart.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ asset_id: selectedAssetId })
        })
        .then(res => res.json())
        .then(data => {
          console.log("Server response:", data);
          if (data.success) {
            alert("Asset added to request!");
            closeOverlay();
          } else {
            alert("Error adding asset to request.");
          }
        })
        .catch(error => {
          console.error("Request failed:", error);
          alert("Connection error.");
        });
      });
    }

function openOverlay(asset) {
    selectedAssetId = asset.id; //  save the selected asset ID

    const overlay = document.getElementById("overlay");
    const overlayImage = document.getElementById("overlay-image");
    const overlayTitle = document.getElementById("overlay-title");
    const overlayType = document.getElementById("overlay-type");
    const overlayResolution = document.getElementById("overlay-resolution");
    const overlayFormat = document.getElementById("overlay-format");

    // Mostrar título y tipo
    overlayTitle.textContent = asset.name;
    overlayType.textContent = asset.type;

    // Detectar formato (extensión) desde el nombre o path
    const extension = asset.file_path.split('.').pop();
    overlayFormat.textContent = extension.toUpperCase();

    // Cargar imagen o video
    if (asset.type.startsWith("image")) {
        overlayImage.src = asset.file_path;
        overlayImage.style.display = "block";
        overlayImage.onload = () => {
        overlayResolution.textContent = `${overlayImage.naturalWidth}x${overlayImage.naturalHeight}`;
        };
    } else {
        overlayImage.style.display = "none";
        overlayResolution.textContent = "N/A";
    }

    overlay.classList.remove("hidden");
    }

    function closeOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.classList.add("hidden");
    }