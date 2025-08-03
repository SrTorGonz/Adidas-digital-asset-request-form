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
      mediaElement.controls = false;
      mediaElement.muted = true;
      mediaElement.loop = true;
      mediaElement.autoplay = true;
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
  selectedAssetId = asset.id;

  // overlay elements
  const overlay = document.getElementById("overlay");
  const mediaBox = document.getElementById("overlay-media");  
  const overlayTitle = document.getElementById("overlay-title");
  const overlayType = document.getElementById("overlay-type");
  const overlayRes = document.getElementById("overlay-resolution");
  const overlayFmt = document.getElementById("overlay-format");

  // clear previous content
  mediaBox.innerHTML = "";

  // Title, type and format
  overlayTitle.textContent = asset.name;
  overlayType.textContent = asset.type;
  const extension = asset.file_path.split('.').pop().toUpperCase();
  overlayFmt.textContent = extension;

  // Create appropriate element based on type
  if (asset.type.startsWith("image") || asset.type.startsWith("vector")) {
    const img = new Image();
    img.src = asset.file_path;
    img.alt = asset.name;
    img.onload = () => {
      overlayRes.textContent = `${img.naturalWidth}x${img.naturalHeight}`;
    };
    mediaBox.appendChild(img);

  } else if (asset.type.startsWith("video")) {
    const video = document.createElement("video");
    video.src = asset.file_path;
    video.controls = true;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.constrolsList = "nodownload";
    video.oncontexmenu = "return false";
    video.onloadedmetadata = () => {
      overlayRes.textContent = `${video.videoWidth}x${video.videoHeight}`;
    };
    mediaBox.appendChild(video);
  } else {
    overlayRes.textContent = "N/A";
  }

  overlay.classList.remove("hidden");
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("hidden");
}