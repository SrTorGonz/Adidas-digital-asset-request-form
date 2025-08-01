document.addEventListener("DOMContentLoaded", () => {
    fetch('get_cart_assets.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error(data.message);
                return;
            }

            const container = document.getElementById('assetCardsContainer');
            container.innerHTML = '';

            data.assets.forEach(asset => {
                const card = document.createElement('div');
                card.classList.add('asset-card');

                card.innerHTML = `
                    <img src="${asset.file_path}" alt="Asset" class="preview">
                    <div class="asset-info">
                        <strong>${asset.name}</strong>
                        <p>TYPE: ${asset.type}</p>
                        <p>FORMAT: ${asset.format}</p>
                        <p>RESOLUTION: ${asset.resolution}</p>
                    </div>
                    <span class="material-symbols-outlined delete-icon" data-id="${asset.id}">delete</span>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading assets:", error));
});