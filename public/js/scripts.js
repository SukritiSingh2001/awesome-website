document.addEventListener("DOMContentLoaded", () => {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("dynamic-content");
      data.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `${item.name} - ${item.role}`;
        container.appendChild(div);
      });
    });
});
