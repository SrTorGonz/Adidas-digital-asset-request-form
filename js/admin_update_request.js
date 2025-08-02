document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get("request_id");

  const approveBtn = document.getElementById("approveBtn");
  const rejectBtn = document.getElementById("rejectBtn");

  const recommendations = document.getElementById("recommendations");

  function submitRequest(status) {
    const data = new FormData();
    data.append("request_id", requestId);
    data.append("recommendations", recommendations.value);
    data.append("status", status);

    fetch("update_request_status.php", {
      method: "POST",
      body: data,
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.success) {
        alert(`Request ${status} successfully!`);
        window.location.href = "adminRequests.html";
      } else {
        alert("Error: " + response.error);
      }
    })
    .catch((err) => {
      alert("Request failed: " + err);
    });
  }

  approveBtn.addEventListener("click", () => submitRequest("approved"));
  rejectBtn.addEventListener("click", () => submitRequest("rejected"));
});
