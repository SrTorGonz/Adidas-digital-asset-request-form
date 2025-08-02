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
                        <span class="material-symbols-outlined delete-icon" data-id="${asset.id}" style="cursor:pointer;">delete</span>
                    `;

                    // Click event for delete icon
                    card.querySelector('.delete-icon').addEventListener('click', () => {
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
    // Send request to submit the form
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