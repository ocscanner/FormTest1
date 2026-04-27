/************************************************************
 * Offsite Firearm Event Portal (Static Demo - GitHub Pages)
 * - Stores requests in localStorage keyed by Request ID
 * - Allows "Open Existing Request" by Request ID
 * - Displays original request read-only + allows updates
 ************************************************************/

const STORAGE_KEY = "offsiteRequests";

/** Load all requests from localStorage */
function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

/** Save all requests to localStorage */
function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

/** Generate REQ-###### */
function generateRequestId() {
  return "REQ-" + Math.floor(100000 + Math.random() * 900000);
}

/** Convert form -> object */
function formToObject(formEl) {
  const fd = new FormData(formEl);
  return Object.fromEntries(fd.entries());
}

/** Safely set text */
function setText(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg || "";
}

/** Safely set input value */
function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
}

/* =========================================================
   NEW REQUEST (new-request.html)
   ========================================================= */

document.getElementById("newRequestForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const requestId = generateRequestId();
  const requestData = formToObject(e.target);

  const requests = loadRequests();
  requests[requestId] = {
    requestId,
    createdAt: new Date().toISOString(),
    request: requestData,
    update: {} // week-of-event updates go here later
  };
  saveRequests(requests);

  // Optional inline status on the page
  setText("formStatus", `Submitted. Your Request ID is ${requestId}`);

  alert(
    `Request submitted (demo).

Your Request ID is:
${requestId}

Use this Request ID to open and update week-of-event details.`
  );

  // Send user back to cover page
  window.location.href = "index.html";
});

/* =========================================================
   OPEN EXISTING + UPDATE (update-request.html)
   ========================================================= */

/** Render original request data into the read-only summary */
function renderRequestSummary(record) {
  // These IDs correspond to fields in update-request.html summary area
  setText("summaryRequestId", record.requestId);

  // Original request fields (match your new-request.html "name=" attributes)
  const r = record.request || {};
  setText("summaryEventName", r.eventName);
  setText("summaryEventDate", r.eventDate);
  setText("summaryRequestDate", r.requestDate);
  setText("summaryEventAddress", r.eventAddress);
  setText("summarySponsorOrg", r.sponsorOrg);
  setText("summarySponsorContact", `${r.sponsorContactName || ""} ${r.sponsorContactInfo ? "(" + r.sponsorContactInfo + ")" : ""}`.trim());
  setText("summaryHandlingStore", `${r.handlingStoreNumber || ""} ${r.handlingStoreCity ? "- " + r.handlingStoreCity : ""}`.trim());
  setText("summaryHandlingContact", r.handlingStoreContact);
  setText("summaryDMEmail", r.dmEmail);
  setText("summaryDescription", r.eventDescription);

  // Show the summary block
  const summary = document.getElementById("requestSummary");
  if (summary) summary.style.display = "block";
}

/** Prefill update fields if they already exist */
function prefillUpdateFields(record) {
  const u = record.update || {};
  setValue("employeesAttending", u.employeesAttending);
  setValue("gunCount", u.gunCount);
  setValue("ownershipStatus", u.ownershipStatus);
  setValue("firearmDescription", u.firearmDescription);
  setValue("transportMethod", u.transportMethod);
  setValue("receivingStoreNumber", u.receivingStoreNumber);
  setValue("transferNumber", u.transferNumber);
}

/** Show update form */
function showUpdateForm() {
  const updateForm = document.getElementById("updateForm");
  if (updateForm) updateForm.style.display = "block";
}

document.getElementById("loadRequestBtn")?.addEventListener("click", () => {
  const enteredId = document.getElementById("requestIdInput")?.value?.trim();
  if (!enteredId) {
    setText("loadStatus", "Please enter a Request ID.");
    return;
  }

  const requests = loadRequests();
  const record = requests[enteredId];

  if (!record) {
    setText("loadStatus", "Request not found (demo mode). Check the Request ID.");
    // hide summary + form if present
    const summary = document.getElementById("requestSummary");
    if (summary) summary.style.display = "none";
    const updateForm = document.getElementById("updateForm");
    if (updateForm) updateForm.style.display = "none";
    return;
  }

  // Save current loaded request in sessionStorage for update submit
  sessionStorage.setItem("activeRequestId", enteredId);

  setText("loadStatus", "Request loaded. Review the original request below and add week-of-event details.");
  renderRequestSummary(record);
  prefillUpdateFields(record);
  showUpdateForm();
});

document.getElementById("updateForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const activeId = sessionStorage.getItem("activeRequestId");
  if (!activeId) {
    setText("updateStatus", "No request loaded. Please load a Request ID first.");
    return;
  }

  const requests = loadRequests();
  const record = requests[activeId];

  if (!record) {
    setText("updateStatus", "Request not found. Please reload the Request ID.");
    return;
  }

  const updateData = formToObject(e.target);
  record.update = {
    ...record.update,
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  requests[activeId] = record;
  saveRequests(requests);

  setText("updateStatus", "Week-of-event update saved (demo).");
});
``
