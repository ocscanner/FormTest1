/************************************************************
 * DEMO: Offsite Firearm Event Portal (Static / GitHub Pages)
 * ----------------------------------------------------------
 * This file simulates:
 *  - New request submission
 *  - Request ID generation
 *  - Loading existing requests
 *  - Week-of-event update submission
 *
 * No backend, no email, no data persistence beyond browser.
 ************************************************************/


/* =========================================================
   NEW REQUEST PAGE LOGIC
   ========================================================= */

// Handle submission of the initial 30-day request form
document.getElementById("newRequestForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  // Generate a demo Request ID
  const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);

  // Save Request ID for demo "open existing request"
  localStorage.setItem("lastRequestId", requestId);

  // Optional: save minimal demo data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  localStorage.setItem("lastRequestData", JSON.stringify(data));

  // Notify user
  alert(
    `Request submitted successfully (demo).

Your Request ID is:
${requestId}

Use this ID to complete Week-of-Event details.`
  );

  // Redirect back to cover page
  window.location.href = "index.html";
});


/* =========================================================
