const form = document.getElementById("requestForm");
const status = document.getElementById("status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "Submitted (demo). In production, this will notify reviewers by email.";
  form.reset();
});
