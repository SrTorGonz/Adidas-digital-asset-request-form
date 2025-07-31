document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");

    fetch("get_assets.php")
        .then(response => response.json())
        .then(data => {
            grid.innerHTML = ""; 
            data.forEach(asset => {
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

                grid.appendChild(card);
            });
        })
        .catch(error => console.error("Error fetching assets:", error));
});