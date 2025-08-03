
document.addEventListener('DOMContentLoaded', () => {
  const assetsGrid = document.querySelector('.assets-grid');
  const searchInput = document.querySelector('.search-container input');
  const filterButtons = document.querySelectorAll('.filters button');
  let allAssets = [];

  // charge approved assets from user
  fetch('get_my_assets.php')
    .then(res => res.json())
    .then(data => {
      allAssets = data;
      renderAssets(allAssets);
    });

  // function to render assets
  async function renderAssets(assets) {
    assetsGrid.innerHTML = ''; // clean the grid

    for (let asset of assets) {
      const format = asset.file_path.split('.').pop().toUpperCase();
      const type = asset.type;
      const img = new Image();
      img.src = asset.file_path;

      // wait for image to load to get resolution
      await new Promise(resolve => {
        img.onload = () => {
          const resolution = `${img.width}x${img.height}`;
          const card = document.createElement('div');
          card.className = 'asset-card';
          card.setAttribute('data-type', type.toLowerCase());
          card.setAttribute('data-name', asset.name.toLowerCase());

          card.innerHTML = `
            <div class="preview">
              <img src="${asset.file_path}" alt="Asset" class="preview">
            </div>
            <div class="asset-info">
              <strong>${asset.name}</strong>
              <p>TYPE: ${type}</p>
              <p>FORMAT: ${format}</p>
              <p>RESOLUTION: ${resolution}</p>
            </div>
            <a href="${asset.file_path}" download>
              <span class="material-symbols-outlined">download</span>
            </a>
          `;
          assetsGrid.appendChild(card);
          resolve();
        };
        img.onerror = resolve; //if doesn't load, continue
      });
    }
  }

  // search filter
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const filtered = allAssets.filter(a =>
      a.name.toLowerCase().includes(searchValue)
    );
    renderAssets(filtered);
  });

  // Filters by type
  let activeFilter = null;

    filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedType = button.dataset.type; // ahora viene del data-type

        if (activeFilter === selectedType) {
        activeFilter = null;
        button.classList.remove('active');
        renderAssets(allAssets); // Mostrar todos los assets
        } else {
        activeFilter = selectedType;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filtered = allAssets.filter(a =>
            a.type.toLowerCase() === activeFilter
        );
        renderAssets(filtered);
        }
    });
    });
});

