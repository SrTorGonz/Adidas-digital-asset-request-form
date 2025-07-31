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

    if (asset.type.startsWith("image")) {
      const img = document.createElement("img");
      img.src = asset.file_path;
      img.alt = asset.name;
      card.appendChild(img);
    } else if (asset.type.startsWith("video")) {
      const video = document.createElement("video");
      video.src = asset.file_path;
      video.controls = true;
      card.appendChild(video);
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