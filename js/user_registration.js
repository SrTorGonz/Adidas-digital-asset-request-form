document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;

    fetch("register_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, role })
    })
    .then(res => res.json())
    .then(data => {
      messageDiv.innerText = data.message;
      messageDiv.style.color = data.success ? "green" : "red";
      if (data.success) form.reset();
    })
    .catch(err => {
      messageDiv.innerText = "Error al registrar el usuario.";
      messageDiv.style.color = "red";
    });
  });
});
