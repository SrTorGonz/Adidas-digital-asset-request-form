document.addEventListener("DOMContentLoaded", () => {
    function loadAssets() {
        fetch('get_cart_assets.php')
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error(data.message);
                    return;
                }

                const container = document.getElementById('assetCardsContainer');
                container.innerHTML = "<h2>SELECTED ASSETS</h2>";

                data.assets.forEach(asset => {
                    const card = document.createElement('div');
                    card.classList.add('asset-card');

                    const mediaHolder = document.createElement('div');
                    mediaHolder.classList.add('preview');

                    const mediaElement = document.createElement(asset.type.toLowerCase() === 'video' ? 'video' : 'img');
                    mediaElement.src = asset.file_path;
                    mediaElement.className = 'preview';
                    mediaElement.setAttribute('alt', 'Asset');
                    mediaElement.muted = true;
                    mediaElement.controls = false;
                    mediaElement.loop = true;
                    mediaElement.autoplay = true;
                    mediaElement.preload = 'metadata';

                    mediaHolder.appendChild(mediaElement);
                

                    const assetInfo = document.createElement('div');
                    assetInfo.classList.add('asset-info');

                    const nameEl = document.createElement('strong');
                    nameEl.textContent = asset.name;

                    const typeEl = document.createElement('p');
                    typeEl.textContent = `TYPE: ${asset.type}`;

                    const formatEl = document.createElement('p');
                    formatEl.textContent = `FORMAT: ${asset.format}`;

                    const resolutionEl = document.createElement('p');
                    resolutionEl.textContent = `RESOLUTION: Loading...`;

                    assetInfo.appendChild(nameEl);
                    assetInfo.appendChild(typeEl);
                    assetInfo.appendChild(formatEl);
                    assetInfo.appendChild(resolutionEl);

                    mediaElement.addEventListener('loadedmetadata', () => {
                        if (asset.type.toLowerCase() === 'video') {
                            resolutionEl.textContent = `RESOLUTION: ${mediaElement.videoWidth}x${mediaElement.videoHeight}`;
                        }
                    });

                    mediaElement.addEventListener('load', () => {
                        if (asset.type.toLowerCase() !== 'video') {
                            resolutionEl.textContent = `RESOLUTION: ${mediaElement.naturalWidth}x${mediaElement.naturalHeight}`;
                        }
                    });

                    const deleteIcon = document.createElement('span');
                    deleteIcon.className = 'material-symbols-outlined delete-icon';
                    deleteIcon.id = 'deleteIcon';
                    deleteIcon.setAttribute('data-id', asset.id);
                    deleteIcon.style.cursor = 'pointer';
                    deleteIcon.textContent = 'delete';

                    deleteIcon.addEventListener('click', () => {
                        const assetId = asset.id;

                        fetch('remove_from_cart.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: `asset_id=${assetId}`
                        })
                            .then(res => res.json())
                            .then(response => {
                                if (response.success) {
                                    loadAssets(); // Recharge assets after removal
                                } else {
                                    alert(response.message);
                                }
                            })
                            .catch(err => {
                                console.error('Error removing asset:', err);
                            });
                    });
                    
                    card.appendChild(mediaHolder);
                    card.appendChild(assetInfo);
                    card.appendChild(deleteIcon);
                    container.appendChild(card);
                });
            })
            .catch(error => console.error("Error loading assets:", error));
    }

    loadAssets();
});

document.querySelector('.submit-btn').addEventListener('click', async () => {
    const purpose = document.getElementById('purpose').value.trim();
    const deadline = document.getElementById('deadline').value.trim();

    // Validate date format DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(deadline)) {
        alert("Date must be in format DD/MM/YYYY");
        return;
    }

    // Validate purpose and deadline    
    if (!purpose || !deadline) {
        alert('Please fill all fields.');
        return;
    }

    try {
        const response = await fetch('submit_request.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ purpose, deadline })
        });

        const result = await response.json();
        if (result.success) {
            alert('Request submitted successfully!');
            window.location.href = "my_requests.html";
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    }
});
