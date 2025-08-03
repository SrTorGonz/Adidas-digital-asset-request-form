
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
  assetsGrid.innerHTML = ''; //clear previous content

  for (let asset of assets) {
    const format = asset.file_path.split('.').pop().toUpperCase();
    const type = asset.type.toLowerCase();
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.setAttribute('data-type', type);
    card.setAttribute('data-name', asset.name.toLowerCase());

    let previewElement;
    let resolution = 'N/A';

    if (type === 'image' || type === 'vector') {
      const img = new Image();
      img.src = asset.file_path;

      await new Promise(resolve => {
        img.onload = () => {
          resolution = `${img.width}x${img.height}`;
          resolve();
        };
        img.onerror = resolve;
      });

      previewElement = `<img src="${asset.file_path}" alt="Asset" class="preview" />`;

    } else if (type === 'video') {
      const video = document.createElement('video');
      video.src = asset.file_path;
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';

      await new Promise(resolve => {
        video.addEventListener('loadedmetadata', () => {
          resolution = `${video.videoWidth}x${video.videoHeight}`;
          resolve();
        });
        video.onerror = resolve;
      });

      previewElement = `
        <video 
          src="${asset.file_path}" 
          muted autoplay loop playsinline 
          class="preview"
          preload="metadata"
          style="max-width: 100%; display: block;">
        </video>`;
    }

    card.innerHTML = `
      <div class="preview">
        ${previewElement}
      </div>
      <div class="asset-info">
        <strong>${asset.name}</strong>
        <p>TYPE: ${type}</p>
        <p>FORMAT: ${format}</p>
        <p>RESOLUTION: ${resolution}</p>
        <p>DEADLINE: ${asset.deadline}</p>
      </div>
      <a href="${asset.file_path}" download>
        <span class="material-symbols-outlined">download</span>
      </a>
    `;

    assetsGrid.appendChild(card);
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

