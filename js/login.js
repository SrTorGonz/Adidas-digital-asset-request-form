document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
        const response = await fetch("login.php", {
        method: "POST",
        body: formData
        });

        const data = await response.json();

        if (data.success) {
        // Redirect based on user role
        if (data.role === "admin") {
            window.location.href = "homeAdmin.html";
        } else {
            window.location.href = "home.html";
        }
        } else {
        alert(data.message);
        }
    } catch (err) {
        alert("Error de conexión con el servidor");
        console.error(err);
    }
    }); 
});