const FORM_ENDPOINT = "";
const STORAGE_KEY = "album-title-vinyl-interest";

const form = document.querySelector("#interest-form");
const note = document.querySelector("#form-note");

function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

async function submitToEndpoint(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Form endpoint rejected the submission");
  }
}

function saveDemoEntry(data) {
  const entries = getEntries();
  entries.push(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.submittedAt = new Date().toISOString();

  submitButton.disabled = true;
  submitButton.textContent = "Registering...";
  note.classList.remove("success");
  note.textContent = "Sending your interest...";

  try {
    if (FORM_ENDPOINT) {
      await submitToEndpoint(data);
    } else {
      saveDemoEntry(data);
    }

    form.reset();
    note.classList.add("success");
    note.textContent = FORM_ENDPOINT
      ? "Done. You are on the vinyl interest list."
      : "Demo saved on this device. Add a form endpoint in script.js for live email capture.";
  } catch (error) {
    note.textContent = "Something went wrong. Please try again in a moment.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Register interest";
  }
});
